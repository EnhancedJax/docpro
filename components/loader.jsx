import React, { createContext, useContext, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <Loader visible={isLoading} />
    </LoaderContext.Provider>
  );
};

const Loader = ({ visible }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(visible ? 1 : 0, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      pointerEvents={visible ? "auto" : "none"}
    >
      <View className="p-6 bg-white rounded-lg">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    </Animated.View>
  );
};

export default Loader;
