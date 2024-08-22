import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import { Platform, View } from "react-native";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import { RadioButtonGroup } from "../components/RadioButton";
import Text from "../components/Text";
import Pressable from "./Pressable";

export default function QuestionCard({
  question,
  index,
  control,
  errors,
  children,
  useRequiredValidator = true,
  ...props
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const indexAsName = useMemo(() => index.toString(), [index]);
  const requiredValidator = useMemo(
    () => (useRequiredValidator ? { required: true } : {}),
    [useRequiredValidator]
  );

  const renderInput = () => {
    switch (question.type) {
      case "text":
      case "textarea":
      case "number":
        return (
          <Input
            control={control}
            name={indexAsName}
            rules={requiredValidator}
            label={question.question}
            placeholder={question.placeholder}
            value={question.value}
            textarea={question.type === "textarea"}
            keyboardType={question.type === "number" ? "numeric" : "default"}
          />
        );
      case "date":
        return (
          <Controller
            control={control}
            rules={requiredValidator}
            render={({ field: { onChange, value } }) => (
              <View>
                {Platform.OS === "ios" ? (
                  <DateTimePicker
                    value={
                      value && /^\d{4}-\d{2}-\d{2}$/.test(value)
                        ? new Date(value)
                        : new Date()
                    }
                    mode="date"
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      onChange(selectedDate.toISOString().split("T")[0]);
                    }}
                  />
                ) : (
                  <Pressable onPress={() => setShowDatePicker(true)}>
                    <View className="flex-row items-center justify-center py-4 rounded-full bg-gray">
                      <Text medium twClass="text-lg">
                        {value || "Select Date"}
                      </Text>
                    </View>
                  </Pressable>
                )}
                {Platform.OS !== "ios" && showDatePicker && (
                  <DateTimePicker
                    value={
                      value && /^\d{4}-\d{2}-\d{2}$/.test(value)
                        ? new Date(value)
                        : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (selectedDate) {
                        onChange(selectedDate.toISOString().split("T")[0]);
                      }
                    }}
                  />
                )}
              </View>
            )}
            name={indexAsName}
          />
        );
      case "radio":
        return (
          <Controller
            control={control}
            rules={requiredValidator}
            render={({ field: { onChange, value } }) => (
              <RadioButtonGroup
                onValueChange={onChange}
                value={value}
                options={question.options}
              ></RadioButtonGroup>
            )}
            name={indexAsName}
          />
        );
      case "checkbox":
        return (
          <Controller
            control={control}
            rules={requiredValidator}
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
            name={indexAsName}
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
      {errors[indexAsName] && (
        <Text twClass="mt-2 text-red-500">
          {errors[indexAsName].message || "This field is required."}
        </Text>
      )}
      {children}
    </View>
  );
}
