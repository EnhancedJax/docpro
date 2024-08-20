import { useRef, useState } from "react";
import { Animated, Pressable as RNPressable } from "react-native";

export default function Pressable({
  children,
  onPress = () => {},
  cooldown = 0,
  animationDuration = 100,
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animationDuration,
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
