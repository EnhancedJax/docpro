import { SafeAreaView } from "react-native";
import Button from "../../components/Button";
import Text from "../../components/Text";
import { useAuthContext } from "../../providers/auth";

export default function Home() {
  const { logout } = useAuthContext();
  return (
    <SafeAreaView>
      <Text>Home</Text>
      <Button
        onPress={() => {
          logout();
        }}
      >
        Logout
      </Button>
    </SafeAreaView>
  );
}
