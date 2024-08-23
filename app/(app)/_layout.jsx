import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="settings" />
      <Stack.Screen
        name="template"
        options={{ presentation: "containedModal" }}
      />
      <Stack.Screen
        name="listen"
        options={{ presentation: "containedModal" }}
      />
    </Stack>
  );
}
