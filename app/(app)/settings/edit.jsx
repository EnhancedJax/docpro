import { yupResolver } from "@hookform/resolvers/yup";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import Button from "../../../components/Button";
import FieldError from "../../../components/FieldError";
import Input from "../../../components/Input";
import QuestionCard from "../../../components/QuestionCard";
import Text from "../../../components/Text";
import { useToast } from "../../../components/toast";
import { EMAIL_FIELD, FIELDS } from "../../../constants/user";
import {
  emailSchema,
  passwordSchema,
  requiredSchema,
} from "../../../schema/edit";

export default function EditProp() {
  const { index, value, isPassword: isPasswordString } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);
  const isPassword = isPasswordString === "true";
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(
      isPassword
        ? passwordSchema
        : index < 0
        ? emailSchema(value)
        : requiredSchema
    ),
    defaultValues: {
      0: value,
    },
  });
  const navigation = useNavigation();
  const { showToast } = useToast();
  const onSubmit = (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setSaved(true);
      showToast({
        message: "Changes saved",
        type: "success",
      });
      router.back();
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (!saved) {
        showToast({
          message: "Changes discarded",
          type: "info",
        });
      }
    });

    return unsubscribe;
  }, [navigation, saved]);

  return (
    <View className="flex-1">
      {!isPassword ? (
        <QuestionCard
          className="h-auto"
          question={FIELDS[index] || EMAIL_FIELD}
          index={0}
          control={control}
          errors={errors}
        >
          <Button
            className="mt-4"
            onPress={handleSubmit(onSubmit)}
            cooldown={1000}
          >
            Save
          </Button>
        </QuestionCard>
      ) : (
        <View className="p-6">
          <Text bold twClass="mb-2 text-xl">
            Edit Password
          </Text>
          <View className="mb-8">
            <Input
              control={control}
              name="oldPassword"
              placeholder="Old password"
              textContentType="oneTimeCode" // fix ios issue
            />
            <FieldError error={errors.oldPassword} />
            <Input
              type="password"
              placeholder="New password"
              control={control}
              name="newPassword"
              twClass="mt-4"
            />
            <FieldError error={errors.newPassword} />
            <Input
              type="password"
              placeholder="Confirm Password"
              control={control}
              name="confirmPassword"
              twClass="mt-4"
            />
            <FieldError error={errors.confirmPassword} />
            <Button
              className="mt-4"
              onPress={handleSubmit(onSubmit)}
              cooldown={1000}
            >
              Save
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
