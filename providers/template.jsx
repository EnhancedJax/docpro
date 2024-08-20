import { yupResolver } from "@hookform/resolvers/yup";
import { StackActions } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useNavigationContainerRef,
} from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  callGetDocument,
  callGetDocumentQuestions,
  callUpdateDocument,
} from "../api/document";
import { useLoader } from "../components/loader";
import { useToast } from "../components/toast";
import { ROUTE_LIST } from "../constants/routes";
import { generateSchema } from "../utils/template";

const TemplateContext = createContext();
export const useTemplate = () => useContext(TemplateContext);

function TemplateProvider({ children }) {
  const { id, name: defaultName } = useLocalSearchParams();
  const navigation = useNavigation();
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();
  const [prematureHandledRemove, setPrematureHandledRemove] = useState(false);
  const [progress, setProgress] = useState(0);
  const [schema, setSchema] = useState(yup.object());
  const form = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { watch, getValues, reset } = form;
  const rootNavigation = useNavigationContainerRef();
  const [questionItem, setQuestionItem] = useState(null);

  //#region Helpers

  const popNavigation = () => {
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  //#region APIs
  const { data: documentData } = useQuery({
    queryKey: ["document", id],
    queryFn: () => callGetDocument(id),
  });
  const fetchedDocumentData = documentData?.type !== undefined;
  const { data: questionsData, isSuccess } = useQuery({
    queryKey: ["documentQuestions", documentData?.type],
    queryFn: () => callGetDocumentQuestions(documentData?.type),
    enabled: fetchedDocumentData,
  });

  useEffect(() => {
    showLoader();
    if (questionsData) {
      // adds the name to the first question
      questionsData.items.unshift({
        question: "Give your document a name",
        type: "text",
        placeholder: defaultName,
        min: 1,
        max: 40,
      });
      setQuestionItem(questionsData.items);
      setSchema(generateSchema(questionsData.items));

      // document answers is an array of arrays. How
      const documentName = documentData?.name;
      const documentAnswers = documentData?.data.reduce(
        (acc, answer, index) => {
          acc[index + 1] = answer;
          return acc;
        },
        {}
      );
      documentAnswers["0"] = documentName;
      reset(documentAnswers);
      setProgress(Object.keys(documentAnswers).length - 1);
      hideLoader();
    }
  }, [questionsData]);

  const updateMutation = useMutation({
    mutationFn: ({ name, data }) => callUpdateDocument(id, name, data),
  });

  //#region Callbacks

  const submit = async (finished = false) => {
    const data = getValues();
    const name = data["0"];
    // remove the name from the data, and turn into array of arrays
    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (key !== "0") {
        acc.push(value);
      }
      return acc;
    }, []);
    try {
      showLoader();
      await updateMutation.mutateAsync({ name, data: formattedData });
    } catch (error) {
      console.log(error);
    } finally {
      hideLoader();
    }
  };

  const handleSaveAsDraft = async () => {
    setPrematureHandledRemove(true);
    await submit(false);
    showToast({
      message: "Saved as draft!",
      type: "success",
    });
    popNavigation();
    router.replace({
      pathname: ROUTE_LIST,
      params: {
        finished: false,
        tab: "drafts",
      },
    });
  };

  const handleSaveAndPay = async () => {
    setPrematureHandledRemove(true);
    await submit(true);
    showToast({
      message: "Saved!",
      type: "success",
    });
    popNavigation();
    router.replace({
      pathname: ROUTE_LIST,
      params: {
        finished: true,
        finishedId: id,
        tab: "finished",
      },
    });
  };

  //#region UseEffects

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === undefined) return;
      const index = parseInt(name);
      const nextIsUnanswered = value[index + 1] === undefined;
      const currentIsEmpty =
        value[name] === "" ||
        value[name] === undefined ||
        (Array.isArray(value[name]) && value[name].length === 0);
      if (nextIsUnanswered) {
        if (currentIsEmpty) {
          setProgress(index);
        } else {
          setProgress(index + 1);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (prematureHandledRemove) return;
      handleSaveAsDraft();
    });

    return unsubscribe;
  }, [navigation, prematureHandledRemove]);

  useEffect(() => {
    console.log("New", id, defaultName);
  }, []);

  if (!fetchedDocumentData || !isSuccess || !questionItem) {
    return null;
  }

  return (
    <TemplateContext.Provider
      value={{
        questionItem,
        handleSaveAsDraft,
        handleSaveAndPay,
        form,
        progress,
        setProgress,
        showToast,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
}

export const withTemplateProvider = (Component) => (props) =>
  (
    <TemplateProvider {...props}>
      <Component {...props} />
    </TemplateProvider>
  );
