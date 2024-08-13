import React from "react";
import { useForm } from "react-hook-form";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
    <SafeAreaView className="h-full bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <View className="flex flex-col flex-grow px-6 pb-12">
            <View className="flex flex-col justify-center flex-grow mb-12">
              <Text twClass="text-tgray text-2xl w-full text-center mb-2">
                Welcome to
              </Text>
              <Text twClass="text-2xl w-full text-center text-6xl" bold>
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
                  <Text twClass="text-softPrimary ml-2" medium>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
