import { Circle } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import Pressable from "./Pressable";
import Text from "./Text";

const RadioButton = ({ text, status, onPress }) => (
  <Pressable onPress={onPress}>
    <View className="flex flex-row items-center p-2 mb-3 rounded-full bg-gray">
      <View
        className={`rounded-full w-10 h-10 flex items-center justify-center mr-4 ${
          status ? "bg-primary" : "bg-text10"
        }`}
      >
        <Circle size={20} color="white" />
      </View>
      <Text twClass="text-base">{text}</Text>
    </View>
  </Pressable>
);

const RadioButtonGroup = ({ options, value, onValueChange, ...props }) => (
  <View {...props}>
    {options.map((option) => (
      <RadioButton
        key={option}
        text={option}
        status={value === option}
        onPress={() => onValueChange(option)}
      />
    ))}
  </View>
);

export { RadioButton, RadioButtonGroup };
