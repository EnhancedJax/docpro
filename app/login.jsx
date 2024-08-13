import React from "react";
import { useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import Text from "../components/Text";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const { control, handleSubmit } = useForm();
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
      <View className="mb-12">
        <Input
          control={control}
          name="email"
          placeholder="Email"
          className="mb-4"
        />
        <Input
          type="password"
          placeholder="Password"
          control={control}
          name="password"
        />
      </View>
      <View>
        <Button className="mb-2" onPress={handleSubmit(onSignupPress)}>
          Sign up
        </Button>
        <View className="flex flex-row justify-center">
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={handleSubmit(onLoginPress)}>
            <Text twClass="ml-2 text-softPrimary" medium>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
