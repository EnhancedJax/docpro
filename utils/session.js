import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../api";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";

export async function removeSession() {
  console.log("--> Removing session");
  delete api.defaults.headers.common["Authorization"];
  await Promise.all([
    AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
    AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
  ]);
}

export async function newSession(accessToken, refreshToken) {
  console.log(
    "--> Creating new session:",
    accessToken.substring(0, 10),
    refreshToken.substring(0, 10)
  );
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
  await Promise.all([
    AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
    AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
  ]);
}
