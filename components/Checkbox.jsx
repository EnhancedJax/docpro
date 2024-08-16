import { Check } from "lucide-react-native";
import { Pressable } from "./Pressable";

export default function Checkbox({ status, onPress }) {
  return (
    <Pressable
      className={`w-10 h-10 flex items-center justify-center ${
        status ? "bg-primary" : "bg-gray"
      }`}
    >
      <Check size={20} color={status ? "white" : "transparent"} />
    </Pressable>
  );
}
