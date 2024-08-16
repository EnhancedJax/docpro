import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Controller } from "react-hook-form";
import { ScrollView, TextInput, View } from "react-native";
import Checkbox from "../components/Checkbox";
import { RadioButtonGroup } from "../components/RadioButton";
import Text from "../components/Text";

export default function QuestionCard({ question, index, control, errors }) {
  const renderInput = () => {
    switch (question.type) {
      case "text":
      case "number":
        return (
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType={
                  question.type === "number" ? "numeric" : "default"
                }
                className="w-full p-2 border border-gray-300 rounded"
              />
            )}
            name={index.toString()}
          />
        );
      case "date":
        return (
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                value={value || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  onChange(selectedDate);
                }}
              />
            )}
            name={index.toString()}
          />
        );
      case "radio":
        return (
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <RadioButtonGroup
                onValueChange={onChange}
                value={value}
                options={question.options}
              ></RadioButtonGroup>
            )}
            name={index.toString()}
          />
        );
      case "checkbox":
        return (
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <View>
                {question.options.map((option) => (
                  <View key={option} className="flex-row items-center">
                    <Checkbox
                      status={
                        value && value.includes(option)
                          ? "checked"
                          : "unchecked"
                      }
                      onPress={() => {
                        const updatedValue = value ? [...value] : [];
                        if (updatedValue.includes(option)) {
                          updatedValue.splice(updatedValue.indexOf(option), 1);
                        } else {
                          updatedValue.push(option);
                        }
                        onChange(updatedValue);
                      }}
                    />
                    <Text>{option}</Text>
                  </View>
                ))}
              </View>
            )}
            name={index.toString()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="flex-col w-full h-full p-4"
      showsVerticalScrollIndicator={false}
    >
      <Text className="mb-2 text-lg font-bold">{question.question}</Text>
      <Text className="mb-4">{question.description}</Text>
      {renderInput()}
      {errors[index.toString()] && (
        <Text className="mt-2 text-red-500">This field is required.</Text>
      )}
    </ScrollView>
  );
}
