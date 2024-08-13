import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const { loginWithLastSession } = useAuthContext();
  const [token, setToken] = useState(-1);

  useEffect(() => {
    loginWithLastSession().then((token) => {
      setToken(token);
    });
  }, []);

  if (token === -1) {
    return null;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return <Redirect href="/(app)/home" />;
}
