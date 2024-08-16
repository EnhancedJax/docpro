import { useRef, useState } from "react";
import { Animated, Pressable as RNPressable } from "react-native";

export default function Pressable({
  children,
  onPress = () => {},
  cooldown = 0,
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(opacityAnim, {
        toValue: 0.5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(opacityAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = () => {
    if (!isDisabled) {
      onPress();
    }
    if (cooldown > 0) {
      setIsDisabled(true);
      setTimeout(() => {
        setIsDisabled(false);
      }, cooldown);
    }
  };

  return (
    <RNPressable
      onPress={handlePress}
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }}
      >
        {children}
      </Animated.View>
    </RNPressable>
  );
}
