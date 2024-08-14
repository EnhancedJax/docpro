import {
  Ubuntu_300Light,
  Ubuntu_300Light_Italic,
  Ubuntu_400Regular,
  Ubuntu_400Regular_Italic,
  Ubuntu_500Medium,
  Ubuntu_500Medium_Italic,
  Ubuntu_700Bold,
  Ubuntu_700Bold_Italic,
  useFonts,
} from "@expo-google-fonts/ubuntu";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { LoaderProvider } from "../components/loader";
import { ToastProvider } from "../components/toast";
import { AuthProvider } from "../providers/auth";
import QueryClientProvider from "../providers/QueryClientProvider";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Ubuntu_300Light,
    Ubuntu_300Light_Italic,
    Ubuntu_400Regular,
    Ubuntu_400Regular_Italic,
    Ubuntu_500Medium,
    Ubuntu_500Medium_Italic,
    Ubuntu_700Bold,
    Ubuntu_700Bold_Italic,
  });
  if (!loaded) {
    return null;
  }

  SplashScreen.hideAsync();

  return (
    <ToastProvider>
      <LoaderProvider>
        <QueryClientProvider>
          <AuthProvider>
            <SafeAreaView className="h-full bg-white">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="login" />
                  </Stack>
                </KeyboardAvoidingView>
              </TouchableWithoutFeedback>
            </SafeAreaView>
          </AuthProvider>
        </QueryClientProvider>
      </LoaderProvider>
    </ToastProvider>
  );
}
