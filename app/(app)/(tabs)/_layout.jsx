import { useQuery } from "@tanstack/react-query";
import { Tabs, useRouter } from "expo-router";
import { FileText, Plus } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { callGetMe } from "../../../api/user";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import Colors from "../../../constants/color";
import { ROUTE_HOME, ROUTE_LIST } from "../../../constants/routes";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const router = useRouter();
  const { data = {} } = useQuery({
    queryKey: ["me"],
    queryFn: callGetMe,
  });

  return (
    <View className="flex-row items-center justify-center w-screen h-20 p-5 bg-white">
      <Pressable
        className={`p-4 rounded-full flex-1 ${
          state.index === 0 ? "bg-secondary10" : ""
        }`}
        onPress={() => router.push(ROUTE_HOME)}
      >
        <View className="flex-row items-center justify-center">
          <Plus
            size={24}
            color={state.index === 0 ? Colors.secondary : Colors.text}
          />
          <Text
            twClass={`text-base ml-2 ${
              state.index === 0 ? "text-secondary" : "text-text"
            }`}
          >
            New document
          </Text>
        </View>
      </Pressable>
      <Pressable
        className={`p-4 rounded-full flex-1 ml-4 relative ${
          state.index === 1 ? "bg-secondary10" : ""
        }`}
        onPress={() => router.push(ROUTE_LIST)}
      >
        <View className="flex-row items-center justify-center">
          <FileText
            size={24}
            color={state.index === 1 ? Colors.secondary : Colors.text}
          />
          <Text
            twClass={`text-base ml-2 ${
              state.index === 1 ? "text-secondary" : "text-text"
            }`}
          >
            My documents
          </Text>
        </View>
        {data?.documents?.unpaid > 0 && (
          <View className="absolute flex items-center justify-center w-6 h-6 rounded-full -top-4 -right-4 bg-payment">
            <Text twClass="text-white">{data?.documents?.unpaid}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
};

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // unmountOnBlur: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ animation: "none" }} />
      <Tabs.Screen name="list" options={{ headerStatusBarHeight: 0 }} />
    </Tabs>
  );
}
