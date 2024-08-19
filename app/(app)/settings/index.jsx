import { StackActions } from "@react-navigation/native";
import { router, useNavigationContainerRef } from "expo-router";
import { View } from "react-native";
import Button from "../../../components/Button";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import { ROUTE_LOGIN, ROUTE_SETTINGS } from "../../../constants/routes";
import { FIELDS } from "../../../constants/user";
import { useAuth } from "../../../providers/auth";

export default function EditUser() {
  const { logout } = useAuth();
  const rootNavigation = useNavigationContainerRef();

  const popNavigation = () => {
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    } finally {
      popNavigation();
      router.replace(ROUTE_LOGIN);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {[
          ...FIELDS,
          {
            displayName: "Email",
            type: "text",
          },
        ].map((field, index) => {
          return (
            <View key={index}>
              <Text twClass="text-base">{field.displayName}</Text>
              <Pressable className="p-3 mt-2 mb-4 text-base rounded-full bg-gray">
                <Text twClass="text-base">Change</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
      <View className="px-6 pb-12">
        <Button
          onPress={() => {
            router.push(`${ROUTE_SETTINGS}/editBasic`);
          }}
          cooldown={1000}
          type="secondary"
          className="mb-2"
        >
          Change email
        </Button>
        <Button
          onPress={() => {}}
          cooldown={1000}
          type="secondary"
          className="mb-2"
        >
          Change password
        </Button>
        <Button onPress={handleLogout} cooldown={1000} type="secondary">
          Logout
        </Button>
      </View>
    </View>
  );
}
