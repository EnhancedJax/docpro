import React from "react";
import { View } from "react-native";
import Button from "../components/Button";
import CardCarousel from "../components/CardCarousel";
import PageDots from "../components/PageDots";
import QuestionCard from "../components/QuestionCard";
import { FIELDS } from "../constants/user";
import { useSignup, withSignupProvider } from "../providers/signup";

function Signup() {
  const {
    control,
    handleSubmit,
    isValid,
    errors,
    onInvalid,
    onSubmit,
    handlePrevious,
    progress,
    setProgress,
    goToIndex,
    setGoToIndex,
    isKeyboardOpen,
  } = useSignup();

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
              progress === FIELDS.length - 1
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
            index={question.key}
            question={question}
            control={control}
            errors={errors}
            useRequiredValidator={false}
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

export default withSignupProvider(Signup);
