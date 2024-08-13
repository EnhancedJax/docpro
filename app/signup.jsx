import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../components/Button";
import Text from "../components/Text";
import { ROUTE_HOME } from "../constants/routes";
import { FORM } from "../constants/signup";

export default function Index() {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: FORM.reduce((acc, field) => {
      acc[field.name] = null;
      return acc;
    }, {}),
  });

  const onSubmit = (data) => {
    console.log(data);
    router.replace(ROUTE_HOME);
  };

  const handleNext = async () => {
    const isStepValid = await trigger(FORM[currentStep].name);
    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, FORM.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderField = () => {
    const thisFormField = FORM[currentStep];
    return (
      <Controller
        control={control}
        name={thisFormField.name}
        rules={{ required: true }}
        render={({ field: { onChange } }) => {
          const value = getValues(thisFormField.name);
          switch (thisFormField.type) {
            case "date":
              return (
                <>
                  <View className="w-full p-2 border border-gray-300 rounded-md">
                    <Text>{value ? value?.toDateString() : "Select date"}</Text>
                  </View>
                  <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, selectedDate) => {
                      if (selectedDate) {
                        onChange(selectedDate);
                      }
                    }}
                  />
                </>
              );
            case "select":
              return (
                <View className="flex-row justify-around w-full">
                  {thisFormField.options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className="flex-row items-center"
                      onPress={() => onChange(option)}
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 border-blue-500 mr-2 ${
                          value === option ? "bg-blue-500" : ""
                        }`}
                      />
                      <Text twClass="ml-2">{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            default:
              return (
                <TextInput
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={value}
                  onChangeText={onChange}
                  placeholder={thisFormField.title}
                />
              );
          }
        }}
      />
    );
  };

  return (
    <View className="justify-between flex-1 p-4">
      <Text twClass="text-center text-xl font-bold">
        Setup ({currentStep + 1}/{FORM.length})
      </Text>

      <View className="items-center justify-center flex-1">
        <Text twClass="text-lg mb-4">{FORM[currentStep].title}</Text>
        {renderField()}
        {errors[FORM[currentStep].name] && (
          <Text twClass="text-red-500 mt-2">This field is required</Text>
        )}
      </View>

      <View className="flex flex-row">
        <Button
          type={currentStep === 0 ? "inactive" : "secondary"}
          onPress={handlePrevious}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        {currentStep === FORM.length - 1 ? (
          <Button onPress={handleSubmit(onSubmit)}>Finish</Button>
        ) : (
          <Button type="secondary" onPress={handleNext}>
            Next
          </Button>
        )}
      </View>
    </View>
  );
}
