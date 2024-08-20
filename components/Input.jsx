import { Eye, EyeOff } from "lucide-react-native";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function Input({
  type = "text",
  rules = null,
  control = null,
  name = null,
  light = false,
  medium = false,
  bold = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [height, setHeight] = useState(0);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };

  const fontFamily = light
    ? "Ubuntu_300Light"
    : medium
    ? "Ubuntu_500Medium"
    : bold
    ? "Ubuntu_700Bold"
    : "Ubuntu_400Regular";

  const renderTextInput = (field) => (
    <TextInput
      onLayout={onLayout}
      secureTextEntry={type === "password" && !showPassword}
      className={`px-3 p-4 text-base rounded-full bg-gray ${
        type === "password" ? "pr-10" : ""
      } ${type === "password" ? "" : props.twClass || ""}`}
      {...props}
      {...field}
      style={{ fontFamily, lineHeight: 18 }}
    />
  );

  if (type === "bare") {
    return renderTextInput({});
  }

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value } }) => (
        <View className={`relative ${props.twClass || ""}`}>
          {renderTextInput({ value, onChangeText: onChange, onBlur })}
          {type === "password" && (
            <View
              className="absolute top-0 flex items-center justify-center right-4"
              style={{ height }}
            >
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#8696BB" />
                ) : (
                  <Eye size={20} color="#8696BB" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    />
  );
}
