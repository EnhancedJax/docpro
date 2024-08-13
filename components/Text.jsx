import { Text as RNText } from "react-native";

export default function Text({
  twClass,
  light = false,
  medium = false,
  bold = false,
  children,
}) {
  return (
    <RNText
      style={{
        fontFamily: light
          ? "Ubuntu_300Light"
          : medium
          ? "Ubuntu_500Medium"
          : bold
          ? "Ubuntu_700Bold"
          : "Ubuntu_400Regular",
      }}
      className={`text-text ${twClass}`}
      // {...props}
    >
      {children}
    </RNText>
  );
}
