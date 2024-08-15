import { useCallback, useState } from "react";
import { Pressable } from "react-native";
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
      <Pressable
        onPress={handlePress}
        className="flex items-center py-3 rounded-full bg-tgray"
        {...props}
      >
        <Text twClass="text-white">{content}</Text>
      </Pressable>
    );
  } else if (type === "inactive") {
    return (
      <Pressable
        className="flex items-center py-3 rounded-full bg-gray"
        onPress={allowAction ? handlePress : () => {}}
        {...props}
      >
        <Text twClass="text-text10">{content}</Text>
      </Pressable>
    );
  } else {
    return (
      <Pressable
        onPress={handlePress}
        className="flex items-center py-3 rounded-full bg-primary"
        {...props}
      >
        <Text twClass="text-white">{content}</Text>
      </Pressable>
    );
  }
}
