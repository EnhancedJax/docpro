import { Pressable } from "react-native";
import Text from "./Text";

export default function Button({
  children = null,
  type = "primary",
  onPress = () => {},
  ...props
}) {
  if (type === "secondary") {
    return (
      <Pressable
        onPress={onPress}
        className="flex items-center px-12 py-3 rounded-full bg-tgray"
        {...props}
      >
        <Text twClass="text-white">{children}</Text>
      </Pressable>
    );
  } else if (type === "inactive") {
    return (
      <Pressable
        className="flex items-center px-12 py-3 rounded-full bg-gray"
        {...props}
      >
        <Text twClass="text-text10">{children}</Text>
      </Pressable>
    );
  } else {
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
}
