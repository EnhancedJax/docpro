import { StripeProvider } from "@stripe/stripe-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Check, NotepadTextDashed, Squirrel } from "lucide-react-native";
import { forwardRef, useEffect, useState } from "react";
import { Alert, Platform, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { callDeleteDocument } from "../../../api/document";
import { callGetMe } from "../../../api/user";
import GradientMask from "../../../components/GradientMask";
import Loader from "../../../components/loader";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import { useToast } from "../../../components/toast";
import Colors from "../../../constants/color";
import FilterView from "../../../containers/list_FilterView";
import SwipeListItem from "../../../containers/list_SwipeListItem";

export default function List() {
  const [filter, setFilter] = useState({
    searchQuery: null,
    sort: 1,
    type: null,
  });
  const { showToast } = useToast();
  const { finished, finishedId } = useLocalSearchParams();
  const [tab, setTab] = useState(finished ? "finished" : "drafts");
  const { data = {}, isFetched } = useQuery({
    queryKey: ["me"],
    queryFn: callGetMe,
  });
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: callDeleteDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      showToast({
        message: "Document deleted",
        type: "success",
      });
    },
  });

  useEffect(() => {
    if (isFetched && finished === undefined) {
      if (
        data.documents.items.filter((item) => item.status !== 0).length === 0
      ) {
        setTab("drafts");
      }
    }
  }, [finished, finishedId, isFetched]);

  const RenderHiddenItem = forwardRef(({ item, tab }, ref) => {
    if (tab === "finished") {
      return null;
    }
    return (
      <Pressable
        ref={ref}
        className={`items-end justify-center flex-1 pr-4 mb-4 ml-10 bg-danger ${
          Platform.OS === "ios" ? "rounded-xl" : "rounded-3xl"
        }`}
        onPress={() => {
          console.log("Deleting item", item.id);
          Alert.alert(
            "Delete",
            "Are you sure you want to delete this draft? ",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                onPress: () => deleteMutation.mutate(item.id),
              },
            ]
          );
        }}
      >
        <Text twClass="text-white">Delete</Text>
      </Pressable>
    );
  });

  if (!isFetched) {
    return <Loader visible />;
  }

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="docpro"
      urlScheme="docpro"
    >
      <View className="flex-col flex-1 bg-white border-b border-neutral-200">
        <View className="flex flex-row px-6 mx-6 mt-2 mb-4 bg-secondary10 rounded-3xl">
          <Pressable
            className={`flex flex-row justify-center flex-1 py-4 ${
              tab === "finished" ? "border-b-2 border-b-secondary" : ""
            }`}
            onPress={() => setTab("finished")}
          >
            <View className="flex flex-row items-center ">
              <Check
                color={tab === "finished" ? Colors.secondary : Colors.tgray}
              />
              <Text
                twClass={`text-lg pl-2 ${
                  tab === "finished" ? "text-secondary" : "text-tgray"
                }`}
                medium={tab === "finished"}
              >
                Finished
              </Text>
            </View>
          </Pressable>
          <Pressable
            className={`flex flex-row justify-center flex-1 py-4 ${
              tab === "drafts" ? "border-b-2 border-b-secondary" : ""
            }`}
            onPress={() => setTab("drafts")}
          >
            <View className="flex flex-row items-center ">
              <NotepadTextDashed
                color={tab === "drafts" ? Colors.secondary : Colors.tgray}
              />
              <Text
                twClass={`text-lg pl-2 ${
                  tab === "drafts" ? "text-secondary" : "text-tgray"
                }`}
                medium={tab === "drafts"}
              >
                Drafts
              </Text>
            </View>
          </Pressable>
        </View>
        <FilterView filter={filter} setFilter={setFilter} />
        <View className="flex flex-row flex-1 pb-6">
          <GradientMask intensity={5}>
            <SwipeListView
              showsVerticalScrollIndicator={false}
              className="flex-1 px-6 pt-6"
              data={
                data?.documents?.items &&
                data?.documents?.items
                  .filter((item) => {
                    return (
                      (!filter.searchQuery ||
                        item.title
                          .toLowerCase()
                          .includes(filter.searchQuery.toLowerCase())) &&
                      (filter.type === null || item.type.id === filter.type) &&
                      (tab === "finished"
                        ? item.status !== 0
                        : item.status === 0)
                    );
                  })
                  .sort((a, b) => {
                    const statusComparison = a.status - b.status;
                    const dateComparison =
                      filter.sort *
                      (new Date(b.date).getTime() - new Date(a.date).getTime());
                    return statusComparison !== 0
                      ? statusComparison
                      : dateComparison;
                  })
              }
              ListEmptyComponent={
                <View className="flex-col items-center justify-center flex-1 pt-10">
                  <Squirrel size={48} color={Colors.tgray} />
                  <Text twClass="text-tgray text-base mt-2">No documents</Text>
                </View>
              }
              renderItem={({ item }) => <SwipeListItem item={item} />}
              renderHiddenItem={({ item }) => (
                <RenderHiddenItem item={item} tab={tab} />
              )}
              rightOpenValue={-75}
              disableRightSwipe
              keyExtractor={(item) => item.id}
            />
          </GradientMask>
        </View>
      </View>
    </StripeProvider>
  );
}
