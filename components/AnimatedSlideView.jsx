import { useNavigation } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

function AnimatedSlideView({ children, direction = "right" }) {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const slideAnim = useRef(
    new Animated.Value(direction === "right" ? 100 : -100)
  ).current;
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      console.log("focus");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });
    const unsubscribeBlur = navigation.addListener("blur", () => {
      console.log("blur");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: direction === "right" ? 100 : -100,
          tension: 20,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  });

  return (
    <Animated.View // Special animatable View
      style={{
        flex: 1,
        opacity: fadeAnim, // Bind opacity to animated value
        transform: [{ translateX: slideAnim }],
      }}
    >
      {children}
    </Animated.View>
  );
}

export default function withAnimatedSlideView(Component, direction = "right") {
  return (props) => (
    <AnimatedSlideView direction={direction} {...props}>
      <Component {...props} />
    </AnimatedSlideView>
  );
}
