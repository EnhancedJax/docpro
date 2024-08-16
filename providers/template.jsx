import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../components/toast";
import { ROUTE_HOME } from "../constants/routes";
import popNavigation from "../utils/popNavigation";

const TemplateContext = createContext();
export const useTemplate = () => useContext(TemplateContext);

function TemplateProvider({ children }) {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [prematureHandledRemove, setPrematureHandledRemove] = useState(false);
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const form = useForm({});
  const { watch } = form;
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (value[name] === "") return;
      const index = parseInt(name);
      setProgress((prev) => (index === prev ? index + 1 : prev));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOnRemove = () => {
    showToast({
      message: "Saved!",
      type: "success",
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!prematureHandledRemove) {
        handleOnRemove();
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log(id);
  }, []);

  const onSubmit = (data) => {
    console.log(Object.values(data));
    handleOnRemove();
    setPrematureHandledRemove(true);
    popNavigation();
    router.replace({
      pathname: ROUTE_HOME,
      params: {
        finished: true,
        finishedId: id,
      },
    });
  };

  return (
    <TemplateContext.Provider
      value={{
        handleBack,
        form,
        onSubmit,
        name,
        setName,
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
