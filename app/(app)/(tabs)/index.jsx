import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowRight, Cog } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { callGetDocumentTypes } from "../../../api/document";
import GradientMask from "../../../components/GradientMask";
import Loader from "../../../components/loader";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import Colors from "../../../constants/color";
import { ROUTE_SETTINGS, ROUTE_TEMPLATE } from "../../../constants/routes";

export default function New() {
  const { data: documentTypes = {}, isFetched } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: callGetDocumentTypes,
  });

  if (!isFetched) {
    return <Loader />;
  }

  return (
    <View className="flex-col flex-1 pt-8 bg-white border-b border-neutral-200">
      <View className="flex flex-row items-center px-6 mb-4">
        <View className="flex-1">
          <Text bold twClass="text-4xl">
            Create new document
          </Text>
        </View>
        <Pressable
          className="p-4 rounded-full"
          onPress={() => router.push(ROUTE_SETTINGS)}
        >
          <Cog size={24} color={Colors.text} />
        </Pressable>
      </View>
      <View className="flex-col flex-1">
        <View className="flex-1 ">
          <GradientMask intensity={5}>
            <ScrollView className="flex-1 px-6 pt-6">
              {documentTypes?.items &&
                documentTypes?.items.map((type, index) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      const id = index;
                      router.push({
                        pathname: ROUTE_TEMPLATE(id),
                        params: { name: `New ${type.name}` },
                      });
                    }}
                    cooldown={1000}
                  >
                    <View className="flex flex-row w-full p-5 mb-3 border bg-secondary10 border-secondary rounded-xl">
                      <View className="flex-1">
                        <Text medium twClass="text-xl">
                          {type.name}
                        </Text>
                        <Text light twClass="text-base mt-2">
                          {type.description}
                        </Text>
                      </View>
                      <View className="flex justify-center ml-3">
                        <ArrowRight size={24} color={Colors.tgray} />
                      </View>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          </GradientMask>
        </View>
      </View>
    </View>
  );
}
