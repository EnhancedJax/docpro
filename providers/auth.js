import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useNavigationContainerRef } from "expo-router";
import React, { createContext, useCallback, useContext } from "react";
import { callLoginUser, callSignupUser } from "../api/auth";
import { useToast } from "../components/toast";
import { ROUTE_ENTRY, ROUTE_HOME } from "../constants/routes";

const rootNavigation = useNavigationContainerRef();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const getNewSession = useCallback(async (data) => {
    console.log(data);
    queryClient.setQueryData(["token"], data.token);
    AsyncStorage.setItem("token", data.token);
    AsyncStorage.setItem("refreshToken", data.refreshToken);
    showToast({
      type: "success",
      message: "Successfully signed up",
    });
    if (rootNavigation.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop()); // pop to top of the stack if possible
    }
    router.replace(ROUTE_HOME);
  }, []);

  const loginMutation = useMutation({
    mutationFn: callLoginUser,
    onSuccess: getNewSession,
  });

  const signupMutation = useMutation({
    mutationFn: callSignupUser,
    onSuccess: getNewSession,
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
      await AsyncStorage.removeItem("refreshToken");
      router.replace(ROUTE_ENTRY);
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
