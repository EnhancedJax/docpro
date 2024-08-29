import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { callUpdateEmail, callUpdateMe, callUpdatePassword } from "../api/user";
import { useToast } from "../components/Toast/provider";
import { ROUTE_LOGIN } from "../constants/routes";
import { FIELDS } from "../constants/user";
import { emailSchema, passwordSchema } from "../schema/edit";
import { generateSchema } from "../utils/template";
import { useAuth } from "./auth";

const EditContext = createContext();
export const useEdit = () => useContext(EditContext);

function EditProvider({ children }) {
  const { index, value, isPassword: isPasswordString } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);
  const { logout } = useAuth();
  const isPassword = useMemo(
    () => isPasswordString === "true",
    [isPasswordString]
  );
  const key = useMemo(() => {
    if (index === "-1") return "email";
    if (isPassword) return "password";
    return FIELDS[index].key;
  }, [index, isPassword]);
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(
      isPassword
        ? passwordSchema
        : key === "email"
        ? emailSchema(value)
        : generateSchema([FIELDS[index]])
    ),
    defaultValues: {
      [key]: value,
    },
  });
  const navigation = useNavigation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  //#region APIs

  const editUserMutation = useMutation({
    mutationFn: callUpdateMe,
    onSuccess: async () => {
      setSaved(true);
      Keyboard.dismiss();
      showToast({
        message: "Changes saved",
        type: "success",
      });
      await queryClient.invalidateQueries({
        queryKey: ["me"],
        refetchType: "all",
      });
      router.back();
    },
  });

  const editEmailMutation = useMutation({
    mutationFn: callUpdateEmail,
    retry: false,
    onSuccess: () => {
      setSaved(true);
      Keyboard.dismiss();
      showToast({
        message: "Email changed, please login again",
        type: "success",
      });
      logout(() => {
        router.replace(ROUTE_LOGIN);
      });
    },
    onError: (error) => {
      const status = error.response?.status;
      if (status === 409) {
        showToast({
          message: "User with this email already exists",
          type: "error",
        });
      } else {
        showToast({
          message: error?.response?.data?.message,
          type: "error",
        });
      }
    },
  });

  const editPasswordMutation = useMutation({
    mutationFn: callUpdatePassword,
    retry: false,
    onSuccess: () => {
      setSaved(true);
      Keyboard.dismiss();
      showToast({
        message: "Password changed, please login again",
        type: "success",
      });
      logout(() => {
        router.replace(ROUTE_LOGIN);
      });
    },
    onError: (error) => {
      if (error.response?.status === 400) {
        showToast({
          message: "Password does not match",
          type: "danger",
        });
      } else {
        showToast({
          message: error.message,
          type: "danger",
        });
      }
    },
  });

  //#region Callbacks

  const handleCancel = () => {
    Keyboard.dismiss();
    setTimeout(() => {
      router.back();
    }, 100);
  };

  const onSubmit = (data) => {
    console.log(data);
    if (key === "email") {
      editEmailMutation.mutate({
        newEmail: data[key],
      });
    } else {
      editUserMutation.mutate({
        key,
        value: data[key] instanceof Date ? data[key].toISOString() : data[key],
      });
    }
  };

  const onPasswordSubmit = (data) => {
    editPasswordMutation.mutate(data);
  };

  //#region useEffects

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
        key,
        onPasswordSubmit,
        handleCancel,
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
