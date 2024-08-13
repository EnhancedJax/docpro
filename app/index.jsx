import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { callGetMe } from "../api/user";
import { ROUTE_HOME, ROUTE_LOGIN, ROUTE_SIGNUP } from "../constants/routes";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const { loginWithLastSession } = useAuthContext();
  const [token, setToken] = useState(-1);
  const [isSignedUp, setIsSignedUp] = useState(-1);
  const queryClient = useQueryClient();
  const getMe = useMutation({
    mutationFn: callGetMe,
    onSuccess: (data) => {
      setIsSignedUp(data?.name !== null);
      queryClient.setQueryData(["me"], data);
    },
  });

  useEffect(() => {
    loginWithLastSession().then((token) => {
      setToken(token);
      getMe.mutate();
    });
  }, []);

  if (token === -1 || isSignedUp === -1) {
    return null;
  }

  if (!token) {
    return <Redirect href={ROUTE_LOGIN} />;
  }

  if (!isSignedUp) {
    return <Redirect href={ROUTE_SIGNUP} />;
  }

  return <Redirect href={ROUTE_HOME} />;
}
