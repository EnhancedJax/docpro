import { Check } from "lucide-react-native";
import { View } from "react-native";
import Pressable from "./Pressable";
import Text from "./Text";

export default function Checkbox({
  status = false,
  onPress = () => {},
  text = "",
  ...props
}) {
  return (
    <Pressable {...props} onPress={onPress}>
      <View className="flex flex-row items-center p-2 mb-3 rounded-xl bg-gray">
        <View
          className={`rounded-xl w-10 h-10 flex items-center justify-center mr-4 ${
            status ? "bg-primary" : "bg-text10"
          }`}
        >
          <Check size={20} color={status ? "white" : "transparent"} />
        </View>
        <Text twClass="text-base">{text}</Text>
      </View>
    </Pressable>
  );
}
