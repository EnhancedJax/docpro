import { Text as RNText } from "react-native";

export default function Text({ light, medium, bold, children, ...props }) {
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
      className={props.twClass}
      {...props}
    >
      {children}
    </RNText>
  );
}
