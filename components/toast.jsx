import { CheckCircle, Info, XCircle } from "lucide-react-native";
import React, { createContext, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DEFAULT_TOAST_DURATION } from "../constants";
import Colors from "../constants/color";
import Pressable from "./Pressable";
import Text from "./Text";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const showToast = ({ message, type = "info" }) => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, DEFAULT_TOAST_DURATION);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast {...toast} onPress={hideToast} />
    </ToastContext.Provider>
  );
};

const Toast = ({ visible, message, type, onPress }) => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(visible ? 1 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          translateY: withTiming(visible ? 0 : -50, {
            duration: 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, {
        duration: DEFAULT_TOAST_DURATION,
        easing: Easing.linear,
      });
    } else {
      progress.value = 0;
    }
  }, [visible]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={24} color={Colors.success} />;
      case "error":
        return <XCircle size={24} color={Colors.danger} />;
      default:
        return <Info size={24} color={Colors.primary} />;
    }
  };

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
      <Pressable className="shadow-lg " onPress={onPress}>
        <View className="relative bg-white rounded-lg">
          <View className="flex-row items-center p-4">
            <View className="mr-3">{getIcon()}</View>
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
