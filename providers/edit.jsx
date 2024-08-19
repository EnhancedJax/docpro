import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { callUpdateMe, callUpdatePassword } from "../api/user";
import { useToast } from "../components/toast";
import { emailSchema, passwordSchema, requiredSchema } from "../schema/edit";

const EditContext = createContext();
export const useEdit = () => useContext(EditContext);

function EditProvider({ children }) {
  const { index, value, isPassword: isPasswordString } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);
  const isPassword = useMemo(
    () => isPasswordString === "true",
    [isPasswordString]
  );
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(
      isPassword
        ? passwordSchema
        : index < 0
        ? emailSchema(value)
        : requiredSchema
    ),
    defaultValues: {
      0: value,
    },
  });
  const navigation = useNavigation();
  const { showToast } = useToast();

  const editUserMutation = useMutation({
    mutationFn: callUpdateMe,
    onSuccess: () => {
      setSaved(true);
      showToast({
        message: "Changes saved",
        type: "success",
      });
      router.back();
    },
  });

  const editPasswordMutation = useMutation({
    mutationFn: callUpdatePassword,
    onSuccess: () => {
      setSaved(true);
      showToast({
        message: "Changes saved",
        type: "success",
      });
      router.back();
    },
  });

  const onSubmit = (data) => {
    editUserMutation.mutate(data);
  };

  const onPasswordSubmit = (data) => {
    editPasswordMutation.mutate(data);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!saved) {
        showToast({
          message: "Changes discarded",
          type: "info",
        });
      }
    });

    return unsubscribe;
  }, [navigation, saved]);

  return (
    <EditContext.Provider
      value={{
        control,
        errors,
        handleSubmit,
        onSubmit,
        isPassword,
        index,
        onPasswordSubmit,
      }}
    >
      {children}
    </EditContext.Provider>
  );
}

export const withEditProvider = (Component) => (props) =>
  (
    <EditProvider {...props}>
      <Component {...props} />
    </EditProvider>
  );
