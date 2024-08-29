import { yupResolver } from "@hookform/resolvers/yup";
import { StackActions } from "@react-navigation/native";
import {
  router,
  useLocalSearchParams,
  useNavigationContainerRef,
} from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { useToast } from "../components/Toast/provider";
import { ROUTE_HOME } from "../constants/routes";
import { FIELDS } from "../constants/user";
import useKeyboard from "../hooks/useKeyboard";
import { useAuth } from "../providers/auth";
import { generateSchema } from "../utils/template";

const SignupContext = createContext();
export const useSignup = () => useContext(SignupContext);

function SignupProvider({ children }) {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { email, password } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const [goToIndex, setGoToIndex] = useState(null);
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: FIELDS.reduce((acc, field) => {
      acc[field.key] = undefined;
      return acc;
    }, {}),
    resolver: yupResolver(generateSchema(FIELDS)),
  });
  const rootNavigation = useNavigationContainerRef();

  const { isKeyboardOpen } = useKeyboard();
  useEffect(() => {
    Keyboard.dismiss();
  }, [progress]);

  const popNavigation = () => {
    console.log(rootNavigation.canGoBack());
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const onInvalid = () => {
    showToast({
      message: "Please answer all questions.",
      type: "error",
    });
    const index = FIELDS.findIndex(
      (field) =>
        errors[Object.keys(errors)[0]] && field.key === Object.keys(errors)[0]
    );
    if (Object.keys(errors).length > 0) {
      setGoToIndex(index);
    }
  };

  const onSubmit = async (data) => {
    const signupData = { info: { ...data }, email, password };
    Keyboard.dismiss();
    await signup(signupData, () => {
      showToast({
        message: "Successfully signed up and logged in!",
        type: "success",
      });
      popNavigation();
      router.replace(ROUTE_HOME);
    });
  };

  const handlePrevious = () => {
    router.back();
  };
  return (
    <SignupContext.Provider
      value={{
        control,
        handleSubmit,
        isValid,
        errors,
        onInvalid,
        onSubmit,
        handlePrevious,
        progress,
        setProgress,
        goToIndex,
        setGoToIndex,
        isKeyboardOpen,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export const withSignupProvider = (Component) => (props) =>
  (
    <SignupProvider {...props}>
      <Component {...props} />
    </SignupProvider>
  );
