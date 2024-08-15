import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "../components/Button";
import CardCarousel from "../components/CardCarousel";
import PageDots from "../components/PageDots";
import Text from "../components/Text";
import { FORM } from "../constants/signup";
import { useAuthContext } from "../providers/auth";

export default function Index() {
  const { signup } = useAuthContext();
  const { email, password } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
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
    const signupData = { ...data, email, password };
    console.log(signupData);
    Keyboard.dismiss();
    signup(signupData);
  };

  const handlePrevious = () => {
    router.back();
  };

  const renderField = (thisFormField) => {
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
    <View className="flex-col flex-1 border-t border-b border-neutral-300">
      <View className="flex-row p-6">
        <Button
          type="secondary"
          onPress={handlePrevious}
          className="flex-1 mr-2"
        >
          Go back
        </Button>
        <Button
          type={isValid ? "primary" : "inactive"}
          onPress={handleSubmit(onSubmit)}
          allowAction
          className="flex-1 ml-2"
        >
          Finish
        </Button>
      </View>
      <CardCarousel activeIndex={progress} setActiveIndex={setProgress}>
        {FORM.map((formField, index) => (
          <View
            key={`FormField${index}`}
            className="items-center justify-center flex-1"
          >
            <Text twClass="text-lg mb-4">{formField.title}</Text>
            {renderField(formField)}
            {errors[formField.name] && (
              <Text twClass="text-red-500 mt-2">This field is required</Text>
            )}
          </View>
        ))}
      </CardCarousel>
      <View className="flex-row w-full h-10">
        <PageDots
          activeIndex={progress}
          totalPages={FORM.length}
          progress={progress}
        />
      </View>
    </View>
  );
}
