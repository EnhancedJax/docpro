import React, { useState } from "react";
import { View } from "react-native";
import Button from "../../components/Button";
import CardCarousel from "../../components/CardCarousel";
import PageDots from "../../components/PageDots";
import QuestionCard from "../../containers/template_QuestionCard";
import { useTemplate, withTemplateProvider } from "../../providers/template";

const Questions = [
  {
    question: "Are you a permanent resident of Hong Kong?",
    description: "This is a description",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    question: "What is your permanent address?",
    description: "This is a description",
    type: "text",
  },
  {
    question: "What is your monthly income?",
    description: "This is a description",
    type: "number",
  },
  {
    question: "When did your term start?",
    description: "This is a description",
    type: "date",
  },
  {
    question: "Please select types of documents you have",
    description: "This is a description",
    type: "checkbox",
    options: ["A", "B", "C"],
  },
];

function Template() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { handleBack, form, onSubmit, progress, showToast } = useTemplate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <View className="flex-col flex-1 border-t border-b border-neutral-300">
      <View className="flex-row p-6">
        <Button type="secondary" onPress={handleBack} className="flex-1 mr-2">
          Save as Draft
        </Button>
        <Button
          type={progress === Questions.length ? "primary" : "inactive"}
          onPress={
            progress === Questions.length
              ? handleSubmit(onSubmit)
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
          Finish
        </Button>
      </View>
      <CardCarousel activeIndex={activeIndex} setActiveIndex={setActiveIndex}>
        {Questions.filter((_, index) => index <= progress).map(
          (question, index) => (
            <QuestionCard
              key={`Question${index}`}
              index={index}
              question={question}
              control={control}
              errors={errors}
            />
          )
        )}
      </CardCarousel>
      <View className="flex-row w-full h-10">
        <PageDots
          activeIndex={activeIndex}
          totalPages={Questions.length}
          progress={progress}
        />
      </View>
    </View>
  );
}

export default withTemplateProvider(Template);
