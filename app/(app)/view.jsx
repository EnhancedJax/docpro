import { useLocalSearchParams } from "expo-router";
import { X } from "lucide-react-native";
import { View } from "react-native";
import PDFView from "react-native-view-pdf";
import Pressable from "../../components/Pressable";
import Text from "../../components/Text";

export default function ViewPDF() {
  const { id, title } = useLocalSearchParams();
  return (
    <View>
      <View>
        <Text>{title}</Text>
        <Pressable>
          <X />
        </Pressable>
      </View>
      <PDFView
        resource={`https://pdfobject.com/pdf/sample.pdf`}
        resourceType="url"
      />
    </View>
  );
}
