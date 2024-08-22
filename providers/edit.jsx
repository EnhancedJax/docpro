import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useNavigationContainerRef,
} from "expo-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { callUpdateMe, callUpdatePassword } from "../api/user";
import { useToast } from "../components/toast";
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
        : generateSchema([FIELDS[index]])
    ),
    defaultValues: {
      [index === "-1" ? "email" : !isPassword ? FIELDS[index].key : "0"]: value,
    },
  });
  const navigation = useNavigation();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const rootNavigation = useNavigationContainerRef();

  const popNavigation = () => {
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const editUserMutation = useMutation({
    retry: false,
    mutationFn: callUpdateMe,
    onSuccess: async () => {
      setSaved(true);
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

  const editPasswordMutation = useMutation({
    retry: false,
    mutationFn: callUpdatePassword,
    onSuccess: () => {
      setSaved(true);
      Keyboard.dismiss();
      logout(() => {
        showToast({
          message: "Password changed, please login again",
          type: "success",
        });
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

  const onSubmit = (data) => {
    const key = index === "-1" ? "email" : FIELDS[index].key;
    editUserMutation.mutate({
      key,
      value: data[key] instanceof Date ? data[key].toISOString() : data[key],
    });
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
