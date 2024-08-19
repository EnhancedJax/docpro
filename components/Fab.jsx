import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import React, { useState } from "react";
import { Pressable as RNPressable, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  FadeInUp,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Text from "./Text";

const FAB = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
    };
  });

  const backgroundAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity.value,
    };
  });

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    rotation.value = withTiming(isOpen ? 0 : 315, {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
    });
    backgroundOpacity.value = withTiming(isOpen ? 0 : 1, { duration: 300 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const handlePressIn = () => {
    scale.value = withTiming(0.8, { duration: 100, easing: Easing.ease });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100, easing: Easing.ease });
  };

  return (
    <View
      className="absolute flex items-end justify-end w-full h-full px-6 py-12"
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          backgroundAnimatedStyle,
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <RNPressable className="flex-1" onPress={toggleMenu}>
          <BlurView intensity={40} className="flex-1" />
        </RNPressable>
      </Animated.View>
      {isOpen && (
        <View className="z-10 mb-4">
          {items.map((item, index) => (
            <Animated.View
              key={index}
              entering={FadeInUp.delay((items.length - index) * 100)
                .duration(300)
                .easing(Easing.out(Easing.ease))}
              exiting={FadeOutDown.delay((items.length - index) * 100)
                .duration(300)
                .easing(Easing.in(Easing.ease))}
            >
              <TouchableOpacity
                onPress={() => item.onPress(index)}
                className="items-center justify-center flex-initial px-4 py-4 mb-2 rounded-full bg-secondary"
              >
                <Text twClass="text-white">{item.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      )}
      <RNPressable
        onPress={toggleMenu}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          style={animatedStyles}
          className="items-center justify-center w-20 h-20 rounded-full shadow-lg bg-primary"
        >
          <Plus size={30} color="white" />
        </Animated.View>
      </RNPressable>
    </View>
  );
};

export default FAB;
