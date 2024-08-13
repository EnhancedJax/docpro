import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Text from "./Text";

const FAB = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    rotation.value = withSpring(isOpen ? 0 : 45);
  };

  return (
    <>
      {isOpen && (
        <BlurView
          intensity={20}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}
      <View className="absolute bottom-6 right-6">
        {isOpen && (
          <View className="mb-4">
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                className="bg-softPrimary rounded-full w-12 h-12 mb-2 items-center justify-center"
              >
                <Text light className="text-white">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Pressable onPress={toggleMenu}>
          <Animated.View
            style={animatedStyles}
            className="bg-primary w-16 h-16 rounded-full items-center justify-center shadow-lg"
          >
            <Text bold className="text-white text-3xl">
              +
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
};

export default FAB;
