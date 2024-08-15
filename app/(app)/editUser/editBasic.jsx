import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import Text from "../../../components/Text";

export default function EditProp() {
  const { prop } = useLocalSearchParams();
  return (
    <View>
      <Text>{prop}</Text>
    </View>
  );
}
