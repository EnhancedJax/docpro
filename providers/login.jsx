import { yupResolver } from "@hookform/resolvers/yup";
import { StackActions } from "@react-navigation/native";
import { router, useNavigationContainerRef } from "expo-router";
import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { ROUTE_ENTRY, ROUTE_SIGNUP } from "../constants/routes";
import { useAuth } from "../providers/auth";
import { schema } from "../schema/login";

const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

function LoginProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState("login");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(schema(currentScreen === "signup")),
  });
  const { login } = useAuth();
  const rootNavigation = useNavigationContainerRef();

  const popNavigation = () => {
    console.log(rootNavigation.canGoBack());
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const handleSignup = (data) => {
    router.push({
      pathname: ROUTE_SIGNUP,
      params: {
        email: data.email,
        password: data.password,
      },
    });
  };

  const handleLogin = async (data) => {
    try {
      await login(data);
    } catch (error) {
      console.log(error);
    } finally {
      router.replace(ROUTE_ENTRY);
    }
  };

  return (
    <LoginContext.Provider
      value={{
        control,
        handleSubmit,
        errors,
        handleSignup,
        handleLogin,
        currentScreen,
        setCurrentScreen,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export const withLoginProvider = (Component) => (props) =>
  (
    <LoginProvider {...props}>
      <Component {...props} />
    </LoginProvider>
  );
