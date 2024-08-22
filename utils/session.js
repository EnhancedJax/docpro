import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";

export async function removeSession() {
  await AsyncStorage.removeItem(ACCESS_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  delete api.defaults.headers.common["Authorization"];
}

export async function newSession(accessToken, refreshToken) {
  console.log(
    "--> Creating new session:",
    accessToken.substring(0, 10),
    refreshToken.substring(0, 10)
  );
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}
