import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  Pressable as RNPressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width: VW, height: VH } = Dimensions.get("window");
const CARD_WIDTH = VW * 0.85;
const MARGIN_FOR_CARD = 5;
const SPACING_FOR_CARD_INSET = (VW - CARD_WIDTH) / 2;
const ANIMATE_SCALE_CARD = 0.85;

const AnimatedCard = ({ index, scrollX, children }) => {
  const { cardSizeStyle } = styles;

  const inputRange = [
    (index - 1) * CARD_WIDTH -
      SPACING_FOR_CARD_INSET +
      MARGIN_FOR_CARD * 2 * (index - 1),
    index * CARD_WIDTH - SPACING_FOR_CARD_INSET + MARGIN_FOR_CARD * 2 * index,
    (index + 1) * CARD_WIDTH -
      SPACING_FOR_CARD_INSET +
      MARGIN_FOR_CARD * 2 * (index + 1),
  ];
  const translateAmount =
    SPACING_FOR_CARD_INSET * ANIMATE_SCALE_CARD - MARGIN_FOR_CARD * 2;

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [ANIMATE_SCALE_CARD, 1, ANIMATE_SCALE_CARD],
      Extrapolation.CLAMP
    );
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-translateAmount, 0, translateAmount],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateX }],
    };
  });

  return (
    <RNPressable style={cardSizeStyle}>
      <Animated.View
        style={[animatedStyle]}
        className="items-center justify-center flex-1 bg-white shadow-md rounded-3xl"
      >
        <View className="flex-1 w-full">{children}</View>
      </Animated.View>
    </RNPressable>
  );
};

export default function CardCarousel({
  activeIndex,
  setActiveIndex = () => {},
  children = null,
  goToIndex = null,
  onFinishGo = () => {},
}) {
  const ref = useRef(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const newActiveIndex = parseInt(
        (event.contentOffset.x + SPACING_FOR_CARD_INSET) / CARD_WIDTH
      );
      if (newActiveIndex !== activeIndex) {
        runOnJS(setActiveIndex)(newActiveIndex);
      }
    },
  });

  useEffect(() => {
    if (goToIndex !== null) {
      ref.current.scrollTo({
        x:
          goToIndex * CARD_WIDTH -
          (SPACING_FOR_CARD_INSET *
            (React.Children.count(children) - goToIndex)) /
            4,
      });
      onFinishGo();
    }
  }, [goToIndex]);

  return (
    <View
      className="flex-row items-center justify-center flex-1 "
      style={{
        paddingLeft: SPACING_FOR_CARD_INSET,
        paddingRight: SPACING_FOR_CARD_INSET,
        overflow: "visible",
      }}
    >
      <Animated.ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0.9}
        disableIntervalMomentum
        snapToInterval={CARD_WIDTH + MARGIN_FOR_CARD}
        className="h-full py-5 "
        style={{
          overflow: "visible",
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {React.Children.map(children, (child, index) => (
          <AnimatedCard key={index} index={index} scrollX={scrollX}>
            {child}
          </AnimatedCard>
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSizeStyle: {
    width: CARD_WIDTH,
    height: "100%",
    marginRight: MARGIN_FOR_CARD,
    marginBottom: 10,
  },
});
