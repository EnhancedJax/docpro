import { Stack, useNavigation } from "expo-router";
import { useEffect } from "react";
import { useToast } from "../../../components/toast";

export default function Layout() {
  const navigation = useNavigation();
  const { showToast } = useToast();

  const handleBack = () => {
    showToast({
      message: "Saved!",
      type: "success",
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      handleBack();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Stack>
      <Stack.Screen name="template0" />
    </Stack>
  );
}
