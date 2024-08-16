import { useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { callGetMe } from "../api/user";
import Loader from "../components/loader";
import { ROUTE_HOME, ROUTE_LOGIN, ROUTE_SIGNUP } from "../constants/routes";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const { loginWithLastSession } = useAuthContext();
  const [authState, setAuthState] = useState({
    isLoading: true,
    token: null,
    isSignedUp: null,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await loginWithLastSession();

        if (!token) {
          setAuthState({ isLoading: false, token: null, isSignedUp: null });
          return;
        }

        const { data: meData } = await queryClient.fetchQuery({
          queryKey: ["me"],
          queryFn: callGetMe,
        });

        setAuthState({
          isLoading: false,
          token,
          isSignedUp: meData?.name !== null,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthState({ isLoading: false, token: null, isSignedUp: null });
      } finally {
      }
    };

    fetchData();
  }, [loginWithLastSession, queryClient]);

  if (authState.isLoading) {
    return <Loader visible />;
  }

  if (!authState.token) {
    return <Redirect href={ROUTE_LOGIN} />;
  }

  if (!authState.isSignedUp) {
    return <Redirect href={ROUTE_SIGNUP} />;
  }

  return <Redirect href={ROUTE_HOME} />;
}
