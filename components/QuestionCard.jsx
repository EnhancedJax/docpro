import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Controller } from "react-hook-form";
import { View } from "react-native";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import { RadioButtonGroup } from "../components/RadioButton";
import Text from "../components/Text";

export default function QuestionCard({
  question,
  index,
  control,
  errors,
  children,
  ...props
}) {
  const renderInput = () => {
    switch (question.type) {
      case "text":
      case "number":
        return (
          <>
            <Input
              control={control}
              name={index.toString()}
              rules={{ required: true }}
              label={question.question}
              placeholder={question.placeholder}
              value={question.value}
              keyboardType={question.type === "number" ? "numeric" : "default"}
            />
          </>
        );
      case "date":
        return (
          <Controller
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <DateTimePicker
                value={
                  value instanceof Date
                    ? value
                    : value !== undefined
                    ? new Date(value)
                    : new Date()
                }
                mode="date"
                display="spinner"
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
                  <Checkbox
                    key={option}
                    status={value && value.includes(option)}
                    onPress={() => {
                      const updatedValue = value ? [...value] : [];
                      if (updatedValue.includes(option)) {
                        updatedValue.splice(updatedValue.indexOf(option), 1);
                      } else {
                        updatedValue.push(option);
                      }
                      onChange(updatedValue);
                    }}
                    text={option}
                  />
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
    <View className="flex-col w-full h-full p-4" {...props}>
      <Text bold twClass="mb-2 text-xl">
        {question.question}
      </Text>
      {question?.description && (
        <Text twClass="mb-8 text-base">{question.description}</Text>
      )}
      {renderInput()}
      {errors[index.toString()] && (
        <Text twClass="mt-2 text-red-500">
          {errors[index.toString()].message || "This field is required."}
        </Text>
      )}
      {children}
    </View>
  );
}
