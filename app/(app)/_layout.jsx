import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
      <Stack.Screen name="editUser" />
      <Stack.Screen name="newDoc" />
    </Stack>
  );
}
