import { router } from "expo-router";
import { View } from "react-native";
import Button from "../../../components/Button";
import Text from "../../../components/Text";
import { ROUTE_EDIT_USER } from "../../../constants/routes";
import { useAuthContext } from "../../../providers/auth";

export default function EditUser() {
  const { logout } = useAuthContext();
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-12">
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
        <Text>Hello</Text>
      </View>
      <View className="px-6 pb-12">
        <Button
          onPress={() => {
            router.push(`${ROUTE_EDIT_USER}/editBasic`);
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
        <Button onPress={logout} cooldown={1000} type="secondary">
          Logout
        </Button>
      </View>
    </View>
  );
}
