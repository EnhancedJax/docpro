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

  if (type === "password") {
    return (
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="relative">
            <TextInput
              secureTextEntry={!showPassword}
              className="p-3 pr-10 text-base rounded-full bg-gray"
              {...props}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
            <View className="absolute flex items-center justify-center h-12 right-3">
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#8696BB" />
                ) : (
                  <Eye size={20} color="#8696BB" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        name={name}
      />
    );
  }

  if (type === "bare") {
    return (
      <TextInput
        className={`p-3 text-base rounded-full bg-gray ${props.twClass}`}
        {...props}
      />
    );
  }

  return (
    <Controller
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <TextInput
          className={`p-3 text-base rounded-full bg-gray ${props.twClass}`}
          {...props}
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          style={{
            fontFamily: light
              ? "Ubuntu_300Light"
              : medium
              ? "Ubuntu_500Medium"
              : bold
              ? "Ubuntu_700Bold"
              : "Ubuntu_400Regular",
          }}
        />
      )}
      name={name}
    />
  );
}
