import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import Text from "../components/Text";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState(null);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { login, signup } = useAuthContext();

  const onSignupPress = (data) => {
    signup(data);
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
        <View className="mb-12">
          <Input
            control={control}
            name="email"
            placeholder="Email"
            className="mb-4"
            textContentType="oneTimeCode"
          />
          <Input
            type="password"
            placeholder="Password"
            control={control}
            name="password"
            className="mb-4"
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
        {(currentScreen === "signup" || currentScreen === null) && (
          <Button
            className="mb-2"
            onPress={() => {
              if (currentScreen === "signup") {
                handleSubmit(onSignupPress)();
              } else {
                setCurrentScreen("signup");
              }
            }}
          >
            Sign up
          </Button>
        )}
        {(currentScreen === "login" || currentScreen === null) && (
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
            <Text>
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
              <Text twClass="ml-2 text-softPrimary" medium>
                {currentScreen === "signup" ? "Login" : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}
