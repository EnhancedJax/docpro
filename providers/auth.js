import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { createContext, useContext } from "react";
import { callLoginUser, callSignupUser } from "../api/auth";
import { useToast } from "../components/toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const loginMutation = useMutation({
    mutationFn: callLoginUser,
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["token"], data.token);
      AsyncStorage.setItem("token", data.token);
      showToast({
        type: "success",
        message: "Successfully logged in",
      });
      router.replace("/(app)/home");
    },
  });

  const signupMutation = useMutation({
    mutationFn: callSignupUser,
    onSuccess: (data) => {
      console.log(data);
      queryClient.setQueryData(["token"], data.token);
      AsyncStorage.setItem("token", data.token);
      showToast({
        type: "success",
        message: "Successfully signed up",
      });
      router.replace("/(app)/home");
    },
  });

  const login = async (data) => {
    loginMutation.mutate(data);
  };

  const signup = async (data) => {
    signupMutation.mutate(data);
  };

  const logout = async () => {
    try {
      queryClient.setQueryData(["token"], null);
      await AsyncStorage.removeItem("token");
      router.replace("/");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  };

  const loginWithLastSession = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        queryClient.setQueryData(["token"], storedToken);
      }
      return storedToken;
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, loginWithLastSession, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
