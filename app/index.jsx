import React from "react";
import { SafeAreaView, View } from "react-native";
import Text from "../components/Text";

export default function Index() {
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="">
        <Text twClass="text-red-500 text-2xl" bold>
          Hello world
        </Text>
        <Text twClass="text-red-500 text-2xl ">Hello world</Text>
      </View>
    </SafeAreaView>
  );
}
