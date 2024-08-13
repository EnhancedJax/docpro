import { Text as RNText } from "react-native";

const defaultClasses = "text-text";

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
      className={`${defaultClasses} ${props.twClass}`}
      {...props}
    >
      {children}
    </RNText>
  );
}
