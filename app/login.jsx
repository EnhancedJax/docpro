import React from "react";
import { TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import FieldError from "../components/FieldError";
import Input from "../components/Input";
import Text from "../components/Text";
import { useLogin, withLoginProvider } from "../providers/login";

function Login() {
  const {
    handleSignup,
    handleLogin,
    currentScreen,
    setCurrentScreen,
    control,
    handleSubmit,
    errors,
  } = useLogin();

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
            textContentType="oneTimeCode" // fix ios issue
          />
          <FieldError error={errors.email} />
          <Input
            type="password"
            placeholder="Password"
            control={control}
            name="password"
            twClass="mt-4"
          />
          <FieldError error={errors.password} />
          {currentScreen === "signup" && (
            <>
              <Input
                type="password"
                placeholder="Confirm Password"
                control={control}
                name="confirmPassword"
                twClass="mt-4"
              />
              <FieldError error={errors.confirmPassword} />
            </>
          )}
        </View>
      )}
      <View>
        <Button
          className="mb-2"
          onPress={() => {
            if (currentScreen === "signup") {
              handleSubmit(handleSignup)();
            } else if (currentScreen === "login") {
              handleSubmit(handleLogin)();
            } else {
              setCurrentScreen(currentScreen === "signup" ? "login" : "signup");
            }
          }}
          cooldown={200}
        >
          {currentScreen === "signup" ? "Sign up" : "Login"}
        </Button>
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
              <Text twClass="ml-2 text-secondary text-base" medium>
                {currentScreen === "signup" ? "Login" : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

export default withLoginProvider(Login);
