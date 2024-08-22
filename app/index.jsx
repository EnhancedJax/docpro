import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
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
    return <Loader visible />;
  }

  return <Redirect href={redirectTo} />;
}
