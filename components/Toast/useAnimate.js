import { useEffect } from "react";
import {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DEFAULT_TOAST_DURATION } from "../../constants";

export const useAnimate = (visible) => {
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
      cancelAnimation(progress);
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: DEFAULT_TOAST_DURATION,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(progress);
      progress.value = 0;
    }
  }, [visible]);

  return { animatedStyle, progressStyle };
};
