import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { callCheckEmail } from "../api/auth";
import { useToast } from "../components/toast";
import { ROUTE_SIGNUP } from "../constants/routes";
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
      email: "user@gmail.com",
      password: "Qqq-12345",
      confirmPassword: "Qqq-12345",
    },
    resolver: yupResolver(schema(currentScreen === "signup")),
  });
  const { login } = useAuth();

  const handleSignup = async (data) => {
    try {
      Keyboard.dismiss();
      await callCheckEmail({ email: data.email });
      router.push({
        pathname: ROUTE_SIGNUP,
        params: {
          email: data.email,
          password: data.password,
        },
      });
    } catch (error) {
      const status = error.response.status;
      if (status === 409 || status === 400) {
        showToast({
          message: "Email already exists",
          type: "error",
        });
      }
    }
  };

  const handleLogin = (data) => {
    const credentials = {
      email: data.email,
      password: data.password,
    };
    login(credentials, () => {
      showToast({
        message: "Login successful!",
        type: "success",
      });
    });
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
