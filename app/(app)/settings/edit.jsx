import { View } from "react-native";
import Button from "../../../components/Button";
import FieldError from "../../../components/FieldError";
import Input from "../../../components/Input";
import QuestionCard from "../../../components/QuestionCard";
import Text from "../../../components/Text";
import { EMAIL_FIELD, FIELDS } from "../../../constants/user";
import { useEdit, withEditProvider } from "../../../providers/edit";

function Edit() {
  const {
    control,
    errors,
    handleSubmit,
    onSubmit,
    onPasswordSubmit,
    isPassword,
    index,
  } = useEdit();

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
              onPress={handleSubmit(onPasswordSubmit)}
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

export default withEditProvider(Edit);
