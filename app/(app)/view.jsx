import { router, useLocalSearchParams } from "expo-router";
import { Download, X } from "lucide-react-native";
import { View } from "react-native";
import PDFViewer from "../../components/PDFViewer";
import Pressable from "../../components/Pressable";
import Text from "../../components/Text";

export default function ViewPDF() {
  const { id, title } = useLocalSearchParams();
  return (
    <View className="flex flex-1 ">
      <View className="flex flex-row items-center justify-between px-4 py-3 bg-primary">
        <Text twClass="text-white text-lg " medium>
          {title}
        </Text>
        <View className="flex flex-row items-center">
          <Pressable className="mr-4">
            <Download color="white" />
          </Pressable>
          <Pressable onPress={() => router.back()}>
            <X color="white" />
          </Pressable>
        </View>
      </View>
      <View className="flex-1 ">
        <PDFViewer />
      </View>
    </View>
  );
}
