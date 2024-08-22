import AsyncStorage from "@react-native-async-storage/async-storage";
import { REFRESH_TOKEN_KEY } from "../constants";
import { api } from "./index";

export const callLoginUser = async ({ credentials }) => {
  console.log("callLoginUser", credentials);
  const response = await api.post("/user/login", credentials);
  return response.data;
};

export const callSignupUser = async ({ userData }) => {
  console.log("callSignupUser", userData);
  const response = await api.post("/user/signup", userData);
  return response.data;
};

export const callLogoutUser = async () => {
  const { data } = await api.post("/user/logout");
  return data;
};

export const callRefreshToken = async () => {
  const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  console.log("callRefreshToken", refreshToken.substring(0, 10));
  return await api.get("/user/refreshTokenRotation", {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });
};

export const callCheckEmail = async ({ email }) => {
  console.log("callCheckEmail", email);
  return await api.post("/user/checkEmail", {
    payload: { email },
  });
};
