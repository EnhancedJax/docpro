import { View } from "react-native";
import Text from "./Text";

export default function PageDots({ activeIndex, totalPages, progress }) {
  return (
    <View className="flex-col items-center justify-center flex-1">
      <View className="flex-row ">
        {Array.from({ length: totalPages }).map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === activeIndex
                ? "bg-primary"
                : index <= progress
                ? "bg-tgray opacity-50"
                : "bg-tgray opacity-10 scale-50"
            }`}
          />
        ))}
      </View>
      <Text twClass="ml-2 text-base">
        {activeIndex + 1} / {totalPages}
      </Text>
    </View>
  );
}
