import { Pressable } from "react-native";
import Text from "./Text";

export default function Button({
  children = null,
  onPress = () => {},
  ...props
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex items-center px-12 py-3 rounded-full bg-primary"
      {...props}
    >
      <Text twClass="text-white">{children}</Text>
    </Pressable>
  );
}
