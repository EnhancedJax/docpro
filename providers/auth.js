import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { createContext, useContext } from "react";
import { callLoginUser, callLogoutUser, callSignupUser } from "../api/auth";
import { useToast } from "../components/toast";
import { ROUTE_ENTRY, ROUTE_HOME } from "../constants/routes";
import { newSession, removeSession } from "../utils/session";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  //#region Mutations

  const loginMutation = useMutation({
    mutationFn: callLoginUser,
    retry: false,
    onError: (error) => {
      if (error.response?.status === 401) {
        showToast({
          message: "Invalid credentials",
          type: "error",
        });
      }
    },
    onSuccess: async (response, { successCallback }) => {
      const accessToken = response.data.accessToken;
      const refreshToken = response.data.refreshToken;
      queryClient.invalidateQueries();
      await newSession(accessToken, refreshToken);
      router.replace(ROUTE_ENTRY);
      successCallback();
    },
  });

  const signupMutation = useMutation({
    mutationFn: callSignupUser,
    retry: false,
    onSuccess: async (response, { successCallback }) => {
      const accessToken = response?.data?.accessToken;
      const refreshToken = response?.data?.refreshToken;
      queryClient.invalidateQueries();
      await newSession(accessToken, refreshToken);
      successCallback();
    },
  });

  const logoutMutation = useMutation({
    mutationFn: callLogoutUser,
    onSuccess: async (data, { successCallback }) => {
      await removeSession();
      successCallback();
    },
    onError: async () => {
      await removeSession();
      router.replace(ROUTE_HOME);
      showToast({
        message: "Please sign in again",
        type: "error",
      });
    },
  });

  //#region Functions

  const login = (credentials, successCallback) =>
    loginMutation.mutate({ credentials, successCallback });
  const signup = (userData, successCallback) =>
    signupMutation.mutate({ userData, successCallback });
  const logout = (successCallback) =>
    logoutMutation.mutate({ successCallback });
  // const refreshToken = (refreshToken) =>
  //   refreshMutation.mutate({ refreshToken });

  //#region useEffects

  // useEffect(() => {
  //   const initAuth = async () => {
  //     const storedRefreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  //     if (storedRefreshToken) {
  //       const decodedRefreshToken = jwtDecode(storedRefreshToken);
  //       const expiresAt = new Date(decodedRefreshToken.exp * 1000);
  //       console.log("storedRefreshToken", storedRefreshToken);
  //       console.log("expiresAt", expiresAt);
  //       if (expiresAt > new Date()) {
  //         console.log("--> Refreshing token");
  //         refreshToken(storedRefreshToken);
  //       } else {
  //         removeSession();
  //       }
  //     }
  //     removeSession(); // cleanup
  //   };
  //   initAuth();
  // }, []);

  const value = {
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
