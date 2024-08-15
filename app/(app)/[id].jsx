import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Button from "../../components/Button";
import CardCarousel from "../../components/CardCarousel";
import PageDots from "../../components/PageDots";
import Text from "../../components/Text";
import { useToast } from "../../components/toast";
import { ROUTE_HOME } from "../../constants/routes";
import popNavigation from "../../utils/popNavigation";

const Questions = [
  {
    question: "What is the capital of France?",
    description: "This is a description",
  },
  {
    question: "What is the capital of France?",
    description: "This is a description",
  },
  {
    question: "What is the capital of France?",
    description: "This is a description",
  },
  {
    question: "What is the capital of France?",
    description: "This is a description",
  },
];

export default function Document() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [prematureHandledRemove, setPrematureHandledRemove] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOnRemove = () => {
    showToast({
      message: "Saved!",
      type: "success",
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!prematureHandledRemove) {
        handleOnRemove();
      }
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log(id);
  }, []);

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
              ? () => {
                  console.log("finish");
                  handleOnRemove();
                  setPrematureHandledRemove(true);
                  popNavigation();
                  router.replace({
                    pathname: ROUTE_HOME,
                    params: {
                      finished: true,
                      finishedId: id,
                    },
                  });
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
              setProgress={setProgress}
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

function QuestionCard({ question, setProgress, index }) {
  const handleProgress = () => {
    setProgress((prev) => (index === prev ? index + 1 : prev));
  };
  return (
    <View className="flex-col items-center justify-center w-full h-full">
      <Text>{question.question}</Text>
      <Button onPress={handleProgress}>Hello</Button>
    </View>
  );
}
