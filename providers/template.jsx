import { yupResolver } from "@hookform/resolvers/yup";
import { StackActions } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useNavigationContainerRef,
} from "expo-router";
import { Loader } from "lucide-react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert } from "react-native";
import * as yup from "yup";
import {
  callDeleteDocument,
  callGetDocument,
  callUpdateDocument,
} from "../api/document";
import { useLoader } from "../components/loader";
import { useToast } from "../components/toast";
import { ROUTE_HOME, ROUTE_LIST } from "../constants/routes";
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
  const queryClient = useQueryClient();
  const [questionItem, setQuestionItem] = useState(null);
  const [goToIndex, setGoToIndex] = useState(null);

  //#region Helpers

  const popNavigation = () => {
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  //#region APIs
  const { data, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => callGetDocument(id),
    staleTime: 0,
  });

  useEffect(() => {
    if (data) {
      // adds the name to the first question
      const questions = data.questions;
      questions.unshift({
        question: "Give your document a name",
        type: "text",
        placeholder: defaultName,
        min: 1,
        max: 40,
      });
      setQuestionItem(questions);
      setSchema(generateSchema(questions));

      // document answers is an array of arrays. How
      const documentName = data?.name;
      const documentAnswers = data?.answers.reduce((acc, answer, index) => {
        acc[index + 1] = answer;
        return acc;
      }, {});
      documentAnswers["0"] = documentName;
      reset(documentAnswers);
      const answerLength = Object.keys(documentAnswers).length;
      const lastAnswer = documentAnswers[(answerLength - 1).toString()];
      const progress = answerLength - (lastAnswer ? 0 : 1);
      setProgress(progress);
      setTimeout(() => {
        setGoToIndex(progress);
      }, 500);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: ({ name, data }) => callUpdateDocument(id, name, data),
    onSuccess: async (response, { successCallback }) => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      successCallback();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => callDeleteDocument(id),
    onSuccess: async (response, { isBeforeRemove }) => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      if (!isBeforeRemove) {
        popNavigation();
      }
      router.replace({
        pathname: ROUTE_HOME,
      });
    },
  });

  //#region Callbacks

  const submit = async (callback) => {
    const data = getValues();
    const name = data["0"];
    // remove the name from the data, and turn into array of arrays
    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      if (key !== "0") {
        acc.push(value);
      }
      return acc;
    }, []);
    updateMutation.mutate({
      name,
      data: formattedData,
      successCallback: callback,
    });
  };

  const handleSaveAsDraft = async (isBeforeRemove = false) => {
    setPrematureHandledRemove(true);
    const data = getValues();
    const name = data["0"];
    if (!name) {
      showToast({
        message: "Draft discarded",
      });
      deleteMutation.mutate(isBeforeRemove);
      return;
    }

    await submit(() => {
      showToast({
        message: "Saved draft!",
        type: "success",
      });
      if (!isBeforeRemove) {
        popNavigation();
      }
      router.replace({
        pathname: ROUTE_LIST,
        params: {
          finished: false,
        },
      });
    });
  };

  const handleSaveAndPay = async () => {
    Alert.alert(
      "Save and pay",
      "You will be redirected to the payment page. You cannot edit the document after this.",
      [
        {
          text: "Save and pay",
          onPress: () => {
            setPrematureHandledRemove(true);
            submit(() => {
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
                },
              });
            });
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
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
      handleSaveAsDraft(true);
    });

    return unsubscribe;
  }, [navigation, prematureHandledRemove]);

  if (isLoading || !questionItem) {
    return <Loader visible />;
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
        goToIndex,
        setGoToIndex,
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
