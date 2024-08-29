import { CheckCircle, Info, XCircle } from "lucide-react-native";
import React from "react";
import { Platform, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../../constants/color";
import Pressable from "../Pressable";
import Text from "../Text";
import { useAnimate } from "./useAnimate";

const Toast = ({ visible, message, type, onPress }) => {
  const insets = useSafeAreaInsets();
  const { animatedStyle, progressStyle } = useAnimate(visible);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          top: insets.top + 12,
        },
      ]}
      className="absolute left-4 right-4 "
    >
      <Pressable onPress={onPress}>
        <View
          className={`relative bg-white rounded-lg ${
            Platform.OS === "ios" ? "shadow-lg" : "border border-neutral-200"
          }`}
        >
          <View className="flex-row items-center p-4">
            <View className="mr-3">
              {type === "success" ? (
                <CheckCircle size={24} color={Colors.success} />
              ) : type === "error" ? (
                <XCircle size={24} color={Colors.danger} />
              ) : (
                <Info size={24} color={Colors.primary} />
              )}
            </View>
            <Text className="text-gray-800">{message}</Text>
          </View>
          <Animated.View
            style={progressStyle}
            className="absolute bottom-0 h-[2px] rounded-b-lg bg-primary"
          />
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default Toast;
