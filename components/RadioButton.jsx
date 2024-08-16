import React from "react";
import { TouchableOpacity, View } from "react-native";
import Text from "./Text";

const RadioButton = ({ value, selected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(value)}
    className="flex-row items-center mb-2"
  >
    <View
      className={`w-5 h-5 rounded-full border-2 ${
        selected ? "border-blue-500" : "border-gray-400"
      } mr-2 items-center justify-center`}
    >
      {selected && <View className="w-3 h-3 bg-blue-500 rounded-full" />}
    </View>
    <Text>{value}</Text>
  </TouchableOpacity>
);

const RadioButtonGroup = ({ options, value, onValueChange }) => (
  <View>
    {options.map((option) => (
      <RadioButton
        key={option}
        value={option}
        selected={value === option}
        onSelect={onValueChange}
      />
    ))}
  </View>
);

export { RadioButton, RadioButtonGroup };
