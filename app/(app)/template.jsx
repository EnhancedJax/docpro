import React, { useEffect, useState } from "react";
import { Keyboard, View } from "react-native";
import Button from "../../components/Button";
import CardCarousel from "../../components/CardCarousel";
import PageDots from "../../components/PageDots";
import QuestionCard from "../../components/QuestionCard";
import useKeyboard from "../../hooks/useKeyboard";
import { useTemplate, withTemplateProvider } from "../../providers/template";

function Template() {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    questionItem,
    handleSaveAsDraft,
    handleSaveAndPay,
    form,
    progress,
    showToast,
    goToIndex,
    setGoToIndex,
  } = useTemplate();
  const {
    control,
    formState: { errors, isValid },
  } = form;

  const { isKeyboardOpen } = useKeyboard();
  useEffect(() => {
    Keyboard.dismiss();
  }, [activeIndex]);

  return (
    <View className="flex-col flex-1 border-t border-b border-neutral-300">
      {!isKeyboardOpen && (
        <View className="flex-row p-6">
          <Button
            type="secondary"
            onPress={
              Object.keys(errors).length > 0
                ? () => {
                    showToast({
                      message: "Please make sure there are no errors.",
                      type: "info",
                    });
                    setGoToIndex(parseInt(Object.keys(errors)[0]));
                  }
                : handleSaveAsDraft
            }
            className="flex-1 mr-2"
          >
            Save Draft
          </Button>
          <Button
            type={
              (progress === questionItem.length && isValid) ||
              (progress > activeIndex && activeIndex < questionItem.length - 1)
                ? "primary"
                : "inactive"
            }
            onPress={
              activeIndex === questionItem.length - 1 && isValid
                ? handleSaveAndPay
                : progress > activeIndex &&
                  activeIndex < questionItem.length - 1
                ? () => {
                    setGoToIndex(activeIndex + 1);
                  }
                : activeIndex < questionItem.length - 1
                ? () => {
                    showToast({
                      message: "Please answer this question first.",
                      type: "info",
                    });
                  }
                : () => {
                    showToast({
                      message: "Please answer all questions.",
                      type: "info",
                    });
                    if (Object.keys(errors).length > 0) {
                      setGoToIndex(parseInt(Object.keys(errors)[0]));
                    }
                  }
            }
            allowAction
            className="flex-1 ml-2"
          >
            {activeIndex === questionItem.length - 1 ? "Save & pay" : "Next"}
          </Button>
        </View>
      )}
      <CardCarousel
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
        goToIndex={goToIndex}
        onFinishGo={() => setGoToIndex(null)}
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
              useRequiredValidator={false}
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
