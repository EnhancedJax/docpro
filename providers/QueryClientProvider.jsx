import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MutationCache,
  QueryClientProvider as QCP,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { callRefreshToken } from "../api/auth";
import { useLoader } from "../components/loader";
import { useToast } from "../components/toast";
import { REFRESH_TOKEN_KEY } from "../constants";
import { ROUTE_LOGIN } from "../constants/routes";
import { newSession, removeSession } from "../utils/session";

export default function QueryClientProvider({ children }) {
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();
  const refreshPromiseRef = useRef(null);

  const refreshAuthToken = useCallback(async () => {
    console.log("--> Refresh auth token");
    if (refreshPromiseRef.current) {
      console.log("--> Returning existing refresh promise");
      return refreshPromiseRef.current;
    }

    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    console.log("--> Creating new refresh promise");
    refreshPromiseRef.current = (async () => {
      try {
        console.log("--> Refreshing token");
        const response = await callRefreshToken();
        const accessToken = response.data.data.accessToken;
        const newRefreshToken = response.data.data.refreshToken;
        console.log("--> Refresh success");
        await newSession(accessToken, newRefreshToken);
        return true;
      } catch (error) {
        console.log("--> Refresh failed", error);
        await removeSession();
        showToast({
          message: "Please sign in again",
          type: "error",
        });
        router.replace(ROUTE_LOGIN);
        return false;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    return refreshPromiseRef.current;
  }, [showToast]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: async (failureCount, error) => {
              console.log("--> Query error", error?.response?.status);
              if (error?.response?.status === 401) {
                console.log("--> Query retry");
                return await refreshAuthToken();
              }
              return failureCount <= 1;
            },
          },
          mutations: {
            retry: async (failureCount, error) => {
              console.log("---> Mutation error", error?.response?.status);
              if (error?.response?.status === 401) {
                console.log("--> Mutation retry");
                return await refreshAuthToken();
              }
              return failureCount <= 1;
            },
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {},
        }),
        mutationCache: new MutationCache({
          onMutate: () => {
            showLoader();
          },
          onSettled: () => {
            hideLoader();
          },
        }),
      })
  );

  return <QCP client={queryClient}>{children}</QCP>;
}
