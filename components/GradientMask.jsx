import MaskedView from "@react-native-masked-view/masked-view";
import { View } from "react-native";
import { LinearGradient } from "react-native-gradients";

export default function GradientMask({
  horizontal = false,
  intensity = 10,
  children,
}) {
  return (
    <MaskedView
      style={{ flex: 1 }}
      maskElement={
        <View className="flex-1">
          <LinearGradient
            className="flex-1"
            angle={horizontal ? 0 : 270}
            colorList={[
              { offset: "0%", color: "#000", opacity: "0" },
              { offset: `${intensity}%`, color: "#000", opacity: "1" },
              { offset: `${100 - intensity}%`, color: "#000", opacity: "1" },
              { offset: "100%", color: "#000", opacity: "0" },
            ]}
          />
        </View>
      }
    >
      {children}
    </MaskedView>
  );
}
