import { StackActions } from "@react-navigation/native";
import {
  router,
  useLocalSearchParams,
  useNavigationContainerRef,
} from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Keyboard, View } from "react-native";
import Button from "../components/Button";
import CardCarousel from "../components/CardCarousel";
import PageDots from "../components/PageDots";
import QuestionCard from "../components/QuestionCard";
import { useToast } from "../components/toast";
import { ROUTE_HOME } from "../constants/routes";
import { FIELDS } from "../constants/user";
import useKeyboard from "../hooks/useKeyboard";
import { useAuth } from "../providers/auth";

export default function Index() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const { email, password } = useLocalSearchParams();
  const [progress, setProgress] = useState(0);
  const [goToIndex, setGoToIndex] = useState(null);
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
  const rootNavigation = useNavigationContainerRef();
  const { isKeyboardOpen } = useKeyboard();
  useEffect(() => {
    Keyboard.dismiss();
  }, [progress]);

  const popNavigation = () => {
    console.log(rootNavigation.canGoBack());
    if (rootNavigation?.canGoBack()) {
      rootNavigation.dispatch(StackActions.popToTop());
    }
  };

  const onInvalid = () => {
    setGoToIndex(0);
    showToast({
      message: "Please answer all questions.",
      type: "error",
    });
  };

  const onSubmit = async (data) => {
    const signupData = { ...data, email, password };
    console.log(signupData);
    Keyboard.dismiss();
    await signup(signupData);
    showToast({
      message: "Successfully signed up and logged in!",
      type: "success",
    });
    popNavigation();
    router.replace(ROUTE_HOME);
  };

  const handlePrevious = () => {
    router.back();
  };

  return (
    <View className="flex-col flex-1 border-t border-b border-neutral-300">
      {!isKeyboardOpen && (
        <View className="flex-row p-6">
          <Button
            type="secondary"
            onPress={handlePrevious}
            className="flex-1 mr-2"
          >
            Go back
          </Button>
          <Button
            type={
              isValid || progress !== FIELDS.length - 1 ? "primary" : "inactive"
            }
            onPress={
              isValid || progress === FIELDS.length - 1
                ? handleSubmit(onSubmit, onInvalid)
                : () => setGoToIndex(progress + 1)
            }
            allowAction
            className="flex-1 ml-2"
          >
            {isValid || progress === FIELDS.length - 1 ? "Finish" : "Next"}
          </Button>
        </View>
      )}
      <CardCarousel
        activeIndex={progress}
        setActiveIndex={setProgress}
        goToIndex={goToIndex}
      >
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
