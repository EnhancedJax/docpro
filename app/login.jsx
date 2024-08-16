import { router } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import Text from "../components/Text";
import { ROUTE_SIGNUP } from "../constants/routes";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState("login");
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { login } = useAuthContext();

  const onSignupPress = (data) => {
    router.push({
      pathname: ROUTE_SIGNUP,
      params: {
        email: data.email,
        password: data.password,
      },
    });
  };

  const onLoginPress = (data) => {
    login(data);
  };

  return (
    <View className="flex flex-col flex-grow px-6 pb-12 bg-white">
      <View className="flex flex-col justify-center flex-grow mb-12">
        <Text twClass="w-full mb-2 text-2xl text-center text-tgray">
          Welcome to
        </Text>
        <Text bold twClass="w-full text-6xl text-center">
          DocPro
        </Text>
      </View>
      {currentScreen !== null && (
        <View className="mb-8">
          <Input
            control={control}
            name="email"
            placeholder="Email"
            twClass="mb-4"
            textContentType="oneTimeCode" // fix ios issue
          />
          <Input
            type="password"
            placeholder="Password"
            control={control}
            name="password"
            twClass="mb-4"
          />
          {currentScreen === "signup" && (
            <Input
              type="password"
              placeholder="Confirm Password"
              control={control}
              name="confirmPassword"
            />
          )}
        </View>
      )}
      <View>
        {currentScreen === "signup" && (
          <Button
            className="mb-2"
            onPress={() => {
              if (currentScreen === "signup") {
                handleSubmit(onSignupPress)();
              } else {
                setCurrentScreen("signup");
              }
            }}
            cooldown={200}
          >
            Sign up
          </Button>
        )}
        {currentScreen === "login" && (
          <Button
            className="mb-2"
            onPress={() => {
              if (currentScreen === "login") {
                handleSubmit(onLoginPress)();
              } else {
                setCurrentScreen("login");
              }
            }}
          >
            Login
          </Button>
        )}
        {currentScreen !== null && (
          <View className="flex flex-row justify-center">
            <Text twClass="text-base">
              {currentScreen === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() => {
                if (currentScreen === "signup") {
                  setCurrentScreen("login");
                } else {
                  setCurrentScreen("signup");
                }
              }}
            >
              <Text twClass="ml-2 text-softPrimary text-base" medium>
                {currentScreen === "signup" ? "Login" : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
