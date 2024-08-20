import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import Pressable from "../components/Pressable";
import Colors from "../constants/color";

export default function ButtonedScrollView({ arrowOffset = 0, children }) {
  const [scrollbarHeight, setScrollbarHeight] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollViewRef = useRef(null);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setScrollbarHeight(height);
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    setShowLeftArrow(contentOffset.x > 0);
    setShowRightArrow(
      contentOffset.x < contentSize.width - layoutMeasurement.width
    );
  };

  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({ x: 0, animated: true });
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <View className="relative ">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        className="flex flex-row"
        showsHorizontalScrollIndicator={false}
        onLayout={onLayout}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {children}
      </ScrollView>
      {showRightArrow && (
        <Pressable
          className="absolute bottom-0 flex flex-row items-center pl-3"
          style={{ height: scrollbarHeight, right: 0 + arrowOffset }}
          onPress={scrollRight}
        >
          <ChevronRight size={24} color={Colors.tgray} />
        </Pressable>
      )}
      {showLeftArrow && (
        <Pressable
          className="absolute bottom-0 flex flex-row items-center pr-3 "
          style={{ height: scrollbarHeight, left: 0 + arrowOffset }}
          onPress={scrollLeft}
        >
          <ChevronLeft size={24} color={Colors.tgray} />
        </Pressable>
      )}
    </View>
  );
}
