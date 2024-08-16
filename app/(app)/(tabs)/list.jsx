import { StripeProvider } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Squirrel } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { callGetMe } from "../../../api/user";
import GradientMask from "../../../components/GradientMask";
import Loader from "../../../components/loader";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import Colors from "../../../constants/color";
import FilterView from "../../../containers/list_FilterView";
import SwipeListItem from "../../../containers/list_SwipeListItem";

export default function List() {
  const [filter, setFilter] = useState({
    searchQuery: null,
    sort: 1,
    type: null,
  });
  const { finished, finishedId, tab: defaultTab } = useLocalSearchParams();
  const [tab, setTab] = useState(defaultTab || "finished");
  const { data = {}, isFetched } = useQuery({
    queryKey: ["me"],
    queryFn: callGetMe,
  });

  useEffect(() => {
    if (finished && finishedId) {
      console.log("Finished", finished, finishedId);
    }
  }, []);

  if (!isFetched) {
    return <Loader />;
  }

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="docpro"
      urlScheme="docpro"
    >
      <View className="flex-col flex-1 pt-8 border-t border-b border-neutral-200 bg-gray">
        <View className="flex-col flex-1">
          <View className="flex flex-row px-6 mt-4">
            <Pressable
              className="px-4 py-2 bg-white rounded-xl"
              onPress={() => setTab("finished")}
            >
              <Text
                twClass={`text-base ${
                  tab === "finished" ? "text-text" : "text-tgray"
                }`}
              >
                My documents
              </Text>
            </Pressable>
            <Pressable
              className="px-4 py-2 ml-4 bg-white rounded-xl"
              onPress={() => setTab("drafts")}
            >
              <Text
                twClass={`text-base ${
                  tab === "drafts" ? "text-text" : "text-tgray"
                }`}
              >
                Drafts
              </Text>
            </Pressable>
          </View>
          <FilterView filter={filter} setFilter={setFilter} />
          <View className="flex-1 ">
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
                        (filter.type === null || item.type === filter.type) &&
                        (tab === "finished"
                          ? item.status !== 0
                          : item.status === 0)
                      );
                    })
                    .sort((a, b) => {
                      const statusComparison = a.status - b.status;
                      const dateComparison = filter.sort * (b.date - a.date);
                      return statusComparison !== 0
                        ? statusComparison
                        : dateComparison;
                    })
                }
                ListEmptyComponent={
                  <View className="flex-col items-center justify-center flex-1 pt-10">
                    <Squirrel size={48} color={Colors.tgray} />
                    <Text twClass="text-tgray text-base mt-2">
                      No documents
                    </Text>
                  </View>
                }
                renderItem={({ item }) => <SwipeListItem item={item} />}
                renderHiddenItem={({ item }) => (
                  <Pressable
                    className="items-end justify-center flex-1 pr-4 mb-4 ml-10 bg-red-500 rounded-xl"
                    onPress={() => {
                      console.log("Deleting item", item.id);
                      Alert.alert(
                        "Delete",
                        "Are you sure you want to delete this item? You won't be able to recover it or request a refund.",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            onPress: () => console.log("Deleted"),
                          },
                        ]
                      );
                    }}
                  >
                    <Text twClass="text-white">Delete</Text>
                  </Pressable>
                )}
                rightOpenValue={-75}
                disableRightSwipe
                keyExtractor={(item) => item.id}
              />
            </GradientMask>
          </View>
        </View>
      </View>
    </StripeProvider>
  );
}
