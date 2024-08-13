import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react-native";
import React, { createContext, useContext, useState } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast {...toast} />
    </ToastContext.Provider>
  );
};

const Toast = ({ visible, message, type }) => {
  const insets = useSafeAreaInsets();
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

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle size={24} color="#10B981" />;
      case "error":
        return <XCircle size={24} color="#EF4444" />;
      case "warning":
        return <AlertCircle size={24} color="#F59E0B" />;
      default:
        return <Info size={24} color="#3B82F6" />;
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
      className="absolute flex-row items-center p-4 bg-white rounded-lg shadow-lg left-4 right-4"
    >
      <View className="mr-3">{getIcon()}</View>
      <Text className="flex-1 text-gray-800">{message}</Text>
    </Animated.View>
  );
};

export default Toast;
