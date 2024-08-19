import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";
import Button from "../components/Button";
import CardCarousel from "../components/CardCarousel";
import PageDots from "../components/PageDots";
import QuestionCard from "../components/QuestionCard";
import { FIELDS } from "../constants/user";
import useKeyboardOpen from "../hooks/useKeyboardOpen";
import { useAuth } from "../providers/auth";

export default function Index() {
  const { signup } = useAuth();
  const { email, password } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: FIELDS.reduce((acc, field, index) => {
      acc[index] = undefined;
      return acc;
    }, {}),
  });

  const isKeyboardOpen = useKeyboardOpen();
  useEffect(() => {
    Keyboard.dismiss();
  }, [progress]);

  const onSubmit = (data) => {
    const signupData = { ...data, email, password };
    console.log(signupData);
    Keyboard.dismiss();
    signup(signupData);
  };

  const handlePrevious = () => {
    router.back();
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
        {FIELDS.map((question, index) => (
          <QuestionCard
            key={`Question${index}`}
            index={index}
            question={question}
            control={control}
            errors={errors}
          />
        ))}
      </CardCarousel>
      <View className="flex-row w-full h-10">
        <PageDots
          activeIndex={progress}
          totalPages={FIELDS.length}
          progress={progress}
        />
      </View>
    </View>
  );
}
