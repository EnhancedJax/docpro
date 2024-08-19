import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { api } from "../api";
import {
  callLoginUser,
  callLogoutUser,
  callRefreshToken,
  callSignupUser,
} from "../api/auth";
import { ACCESS_TOKEN_TIMEOUT, REFRESH_TOKEN_KEY } from "../constants";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const refreshTimerRef = useRef(null);
  const [accessToken, setAccessToken] = useState(0); // 0 means not set yet (null means no access token)

  const loginMutation = useMutation({
    mutationFn: callLoginUser,
    onMutate: () => {
      setAccessToken(0);
    },
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      scheduleTokenRefresh();
    },
  });

  const signupMutation = useMutation({
    mutationFn: callSignupUser,
    onMutate: () => {
      setAccessToken(0);
    },
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      scheduleTokenRefresh();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: callLogoutUser,
    onSuccess: async () => {
      setAccessToken(null);
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
      clearTimeout(refreshTimerRef.current);
      api.defaults.headers.common["Authorization"] = "";
    },
  });

  const refreshMutation = useMutation({
    mutationFn: callRefreshToken,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      scheduleTokenRefresh();
    },
    onError: () => {
      // If refresh fails, log out the user
      logout();
    },
  });

  const login = (credentials) => loginMutation.mutate(credentials);
  const signup = (userData) => signupMutation.mutate(userData);
  const logout = () => logoutMutation.mutate();

  const scheduleTokenRefresh = () => {
    clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      refreshMutation.mutate();
    }, ACCESS_TOKEN_TIMEOUT - 5000); // Refresh 5 seconds before expiration
  };

  const manualRefresh = () => {
    return refreshMutation.mutateAsync();
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (storedRefreshToken) {
        refreshMutation.mutate();
      } else {
        setAccessToken(null);
      }
    };
    initAuth();
    return () => clearTimeout(refreshTimerRef.current);
  }, []);

  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  const value = {
    accessToken,
    login,
    signup,
    logout,
    refreshToken: manualRefresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
