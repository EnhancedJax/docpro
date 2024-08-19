import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../components/toast";
import { ROUTE_ENTRY, ROUTE_SIGNUP } from "../constants/routes";
import { useAuth } from "../providers/auth";
import { schema } from "../schema/login";

const LoginContext = createContext();
export const useLogin = () => useContext(LoginContext);

function LoginProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState("login");
  const { showToast } = useToast();
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
    await login(data);
    showToast({
      message: "Login successful!",
      type: "success",
    });
    router.replace(ROUTE_ENTRY);
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
