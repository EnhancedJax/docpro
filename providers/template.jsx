import { yupResolver } from "@hookform/resolvers/yup";
import { StackActions } from "@react-navigation/native";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useNavigationContainerRef,
} from "expo-router";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useLoader } from "../components/loader";
import { useToast } from "../components/toast";
import { ROUTE_LIST } from "../constants/routes";

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
  const { watch, getValues } = form;
  const rootNavigation = useNavigationContainerRef();

  const popNavigation = () => {
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const questionItem = useMemo(() => {
    return [
      {
        question: "Give your document a name",
        type: "text",
        placeholder: defaultName,
        min: 1,
        max: 10,
      },
      {
        question: "Please select types of documents you have",
        description: "This is a description",
        type: "checkbox",
        options: ["A", "B", "C"],
        min: 1,
        max: 3,
      },
      {
        question: "Are you a permanent resident of Hong Kong?",
        description: "This is a description",
        type: "radio",
        options: ["Yes", "No"],
      },
      {
        question: "When did your term start?",
        description: "This is a description",
        type: "date",
        min: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        max: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
      {
        question: "What is your permanent address?",
        description: "This is a description",
        type: "textarea",
        placeholder: "Enter your address",
        min: 1,
        max: 40,
      },
      {
        question: "What is your monthly income?",
        description: "This is a description",
        type: "number",
        placeholder: "Enter your monthly income",
        min: 1,
        max: 1000000,
      },
    ];
  }, [defaultName]);

  useEffect(() => {
    const generatedSchema = yup.object().shape(
      questionItem.reduce((acc, question, index) => {
        switch (question.type) {
          case "text":
          case "textarea":
            acc[index] = yup
              .string()
              .min(question.min, `Minimum ${question.min} characters`)
              .max(question.max, `Maximum ${question.max} characters`)
              .required("This field is required");
            break;
          case "checkbox":
            acc[index] = yup
              .array()
              .of(yup.string())
              .min(question.min, `Select at least ${question.min} option(s)`)
              .max(question.max, `Select at most ${question.max} option(s)`)
              .required("This field is required");
            break;
          case "radio":
            acc[index] = yup
              .string()
              .oneOf(question.options, "Invalid option")
              .required("This field is required");
            break;
          case "date":
            acc[index] = yup
              .date()
              .min(
                question.min,
                `Date must be after ${question.min.toDateString()}`
              )
              .max(
                question.max,
                `Date must be before ${question.max.toDateString()}`
              )
              .required("This field is required");
            break;
          case "number":
            acc[index] = yup
              .number()
              .typeError("Please enter a number")
              .min(question.min, `Minimum value is ${question.min}`)
              .max(question.max, `Maximum value is ${question.max}`)
              .required("This field is required");
            break;
        }
        return acc;
      }, {})
    );
    setSchema(generatedSchema);
  }, [questionItem]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
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
    console.log("Create update document request", name, formattedData);
    try {
      showLoader();
      await new Promise((resolve) => setTimeout(resolve, 300));
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
