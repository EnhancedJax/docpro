import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, SplashScreen } from "expo-router";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY } from "../constants";
import { ROUTE_HOME, ROUTE_LOGIN } from "../constants/routes";

export default function Index() {
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    async function checkAccessToken() {
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
      setRedirectTo(accessToken ? ROUTE_HOME : ROUTE_LOGIN);
    }
    checkAccessToken();
  }, []);

  if (redirectTo === null) {
    return null;
  }

  setTimeout(() => {
    SplashScreen.hideAsync();
  }, 100);

  return <Redirect href={redirectTo} />;
}
