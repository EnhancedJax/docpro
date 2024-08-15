import { Stack } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: ({ navigation, route }) => (
          <View className="flex-row items-center px-4 py-3 bg-white">
            <Pressable onPress={() => navigation.goBack()} className="mr-4">
              <ChevronLeft size={24} color="#000" />
            </Pressable>
            <Text bold twClass="text-lg">
              {route.name === "index" ? "User information" : "Edit property"}
            </Text>
          </View>
        ),
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="editBasic" />
    </Stack>
  );
}
