import { View } from "react-native";
import Text from "./Text";

export default function PageDots({ activeIndex, totalPages, progress }) {
  return (
    <View className="flex-row items-center justify-center flex-1">
      <Text twClass="mr-2">{activeIndex + 1}</Text>
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
      <Text twClass="ml-2">{totalPages}</Text>
    </View>
  );
}
