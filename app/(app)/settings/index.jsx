import { StackActions } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { router, useNavigationContainerRef } from "expo-router";
import { PenLine } from "lucide-react-native";
import { View } from "react-native";
import { callGetMe } from "../../../api/user";
import Button from "../../../components/Button";
import Loader from "../../../components/loader";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import { useToast } from "../../../components/Toast/provider";
import Colors from "../../../constants/color";
import { ROUTE_LOGIN, ROUTE_SETTINGS_EDIT } from "../../../constants/routes";
import { EMAIL_FIELD, FIELDS } from "../../../constants/user";
import { useAuth } from "../../../providers/auth";

export default function EditUser() {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const rootNavigation = useNavigationContainerRef();
  const { data = {}, isFetched } = useQuery({
    queryKey: ["me"],
    queryFn: callGetMe,
  });

  const popNavigation = () => {
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const handleLogout = () => {
    logout(() => {
      showToast({
        message: "Logout successful!",
        type: "success",
      });
      popNavigation();
      router.replace(ROUTE_LOGIN);
    });
  };

  if (!isFetched) return <Loader visible />;

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6">
        {[EMAIL_FIELD, ...FIELDS].map((field, index) => {
          const isEmail = field.key === "email";
          return (
            <View key={index}>
              <Text twClass="text-base">{field.displayName}</Text>
              <Pressable
                className="relative p-3 mt-2 mb-4 text-base rounded-full bg-gray"
                onPress={() => {
                  router.push({
                    pathname: ROUTE_SETTINGS_EDIT,
                    params: {
                      index: isEmail ? -1 : index - 1,
                      value: data[field.key],
                      isPassword: "false",
                    },
                  });
                }}
              >
                <View className="absolute flex-row items-center h-full ">
                  <PenLine size={16} color={Colors.text} />
                </View>
                <Text twClass="text-base ml-8">{data[field.key]}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
      <View className="px-6 pb-12">
        <Button
          onPress={() => {
            router.push({
              pathname: ROUTE_SETTINGS_EDIT,
              params: {
                isPassword: "true",
              },
            });
          }}
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
