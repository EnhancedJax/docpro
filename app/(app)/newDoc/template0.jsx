import React from "react";
import {
  Dimensions,
  Platform,
  Pressable as RNPressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";

const { width: VW, height: VH } = Dimensions.get("window");
const CARD_WIDTH = VW * 0.8;
const CARD_HEIGHT = VH * 0.7;
const MARGIN_FOR_CARD = 5;
const SPACING_FOR_CARD_INSET = (VW - CARD_WIDTH) / 2; // this value is for
const ANIMATE_SCALE_CARD = 0.85;

const cards = [
  { name: "Card 1" },
  { name: "Card 2" },
  { name: "Card 3" },
  { name: "Card 3" },
  { name: "Card 3" },
  { name: "Card 3" },
  { name: "Card 3" },
  { name: "Card 3" },
  { name: "Card 3" },
];

const AnimatedCard = ({ index, card, scrollX }) => {
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
        className="items-center justify-center flex-1 bg-white shadow-xl rounded-3xl"
      >
        <Pressable
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>{card.name}</Text>
        </Pressable>
      </Animated.View>
    </RNPressable>
  );
};

export default function Document() {
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View className="flex-row items-center justify-center flex-1">
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate={0}
        snapToInterval={CARD_WIDTH + 10}
        contentOffset={{ x: -SPACING_FOR_CARD_INSET }}
        snapToAlignment="center"
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {cards.map((card, index) => (
          <AnimatedCard
            key={index}
            index={index}
            card={card}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  cardSizeStyle: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: MARGIN_FOR_CARD,
  },
});
