import { StackActions } from "@react-navigation/native";
import { useNavigationContainerRef } from "expo-router";

const rootNavigation = useNavigationContainerRef();

export default function popNavigation() {
  if (rootNavigation.canGoBack()) {
    rootNavigation.dispatch(StackActions.popToTop()); // pop to top of the stack if possible
  }
}
