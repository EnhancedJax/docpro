import React, { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import Button from "../../components/Button";
import CardCarousel from "../../components/CardCarousel";
import PageDots from "../../components/PageDots";
import QuestionCard from "../../components/QuestionCard";
import useKeyboardOpen from "../../hooks/useKeyboardOpen";
import { useTemplate, withTemplateProvider } from "../../providers/template";
function Template() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [goToIndex, setGoToIndex] = useState(null);
  const {
    questionItem,
    handleSaveAsDraft,
    handleSaveAndPay,
    form,
    progress,
    showToast,
  } = useTemplate();
  const {
    control,
    formState: { errors },
  } = form;

  const isKeyboardOpen = useKeyboardOpen();
  useEffect(() => {
    Keyboard.dismiss();
  }, [activeIndex]);

  return (
    <View className="flex-col flex-1 border-t border-b border-neutral-300">
      <View className={`flex-row p-6 ${isKeyboardOpen ? "hidden" : ""}`}>
        <Button
          type="secondary"
          onPress={handleSaveAsDraft}
          className="flex-1 mr-2"
        >
          Save as Draft
        </Button>
        <Button
          type={
            progress === questionItem.length || progress > activeIndex
              ? "primary"
              : "inactive"
          }
          onPress={
            progress === questionItem.length
              ? handleSaveAndPay
              : progress > activeIndex
              ? () => {
                  setGoToIndex(activeIndex + 1);
                }
              : () => {
                  showToast({
                    message: "You must answer all questions.",
                    type: "info",
                  });
                }
          }
          allowAction
          className="flex-1 ml-2"
        >
          {progress === questionItem.length ? "Finish" : "Next"}
        </Button>
      </View>
      <CardCarousel
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        goToIndex={goToIndex}
      >
        {questionItem
          .filter((_, index) => index <= progress)
          .map((question, index) => (
            <QuestionCard
              key={`Question${index}`}
              index={index}
              question={question}
              control={control}
              errors={errors}
            />
          ))}
      </CardCarousel>
      <View className="flex-row w-full h-10 mb-2 ">
        <PageDots
          activeIndex={activeIndex}
          totalPages={questionItem.length}
          progress={progress}
        />
      </View>
    </View>
  );
}

export default withTemplateProvider(Template);
