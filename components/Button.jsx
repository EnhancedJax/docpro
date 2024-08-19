import { useCallback, useState } from "react";
import { View } from "react-native";
import Pressable from "./Pressable";
import Text from "./Text";

export default function Button({
  children = null,
  type = "primary",
  onPress = () => {},
  allowAction = false,
  cooldown = 0,
  ...props
}) {
  const [isOnCooldown, setIsOnCooldown] = useState(false);

  const handlePress = useCallback(() => {
    if (isOnCooldown) return;

    onPress();

    if (cooldown > 0) {
      setIsOnCooldown(true);
      setTimeout(() => setIsOnCooldown(false), cooldown);
    }
  }, [onPress, cooldown, isOnCooldown]);

  const content = isOnCooldown ? "..." : children;

  if (type === "secondary") {
    return (
      <Pressable onPress={handlePress} {...props}>
        <View className="flex items-center py-3 rounded-full bg-tgray">
          <Text twClass="text-base text-white">{content}</Text>
        </View>
      </Pressable>
    );
  } else if (type === "inactive") {
    return (
      <Pressable onPress={allowAction ? handlePress : () => {}} {...props}>
        <View className="flex items-center py-3 rounded-full bg-gray">
          <Text twClass="text-base text-text10">{content}</Text>
        </View>
      </Pressable>
    );
  } else {
    return (
      <Pressable onPress={handlePress} {...props}>
        <View className="flex items-center py-3 rounded-full bg-primary">
          <Text twClass="text-base text-white">{content}</Text>
        </View>
      </Pressable>
    );
  }
}
