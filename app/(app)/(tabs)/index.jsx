import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ArrowRight, Cog } from "lucide-react-native";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import {
  callCreateDocument,
  callGetDocumentTypes,
} from "../../../api/document";
import GradientMask from "../../../components/GradientMask";
import { useLoader } from "../../../components/loader";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import Colors from "../../../constants/color";
import { ROUTE_SETTINGS, ROUTE_TEMPLATE } from "../../../constants/routes";

export default function New() {
  const queryClient = useQueryClient();
  const { showLoader, hideLoader } = useLoader();
  const {
    data: documentTypes = [],
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: callGetDocumentTypes,
  });

  useEffect(() => {
    if (isFetching || isLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isFetching, isLoading]);

  const newDocumentMutation = useMutation({
    mutationFn: callCreateDocument,
    onSuccess: async (data, { newDocumentNamePlaceholder }) => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      router.push({
        pathname: ROUTE_TEMPLATE,
        params: { id: data.id, name: newDocumentNamePlaceholder },
      });
    },
  });

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
          cooldown={1000}
        >
          <Cog size={24} color={Colors.text} />
        </Pressable>
      </View>
      <View className="flex-col flex-1">
        <View className="flex-1 ">
          <GradientMask intensity={5}>
            <ScrollView className="flex-1 px-6 pt-6">
              {documentTypes &&
                documentTypes.map((type, index) => (
                  <Pressable
                    key={index}
                    onPress={async () => {
                      try {
                        newDocumentMutation.mutate({
                          documentTypeId: type._id,
                          newDocumentNamePlaceholder: `New ${type.name}`,
                        });
                      } catch (error) {
                        console.error("Error creating document:", error);
                      }
                    }}
                    cooldown={1000}
                  >
                    <View className="flex flex-row w-full p-5 mb-3 border bg-secondary10 border-secondary rounded-xl">
                      <View className="flex-1">
                        <Text medium twClass="text-xl">
                          {type.name}
                        </Text>
                        <Text light twClass="text-base mt-2">
                          {type.description || "No description"}
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
