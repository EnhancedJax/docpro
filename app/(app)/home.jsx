import { StripeProvider } from "@stripe/stripe-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Squirrel, UserRoundPen } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import FAB from "../../components/Fab";
import GradientMask from "../../components/GradientMask";
import Pressable from "../../components/Pressable";
import Text from "../../components/Text";
import { DOCUMENT_TYPES } from "../../constants";
import Colors from "../../constants/color";
import { ROUTE_EDIT_USER } from "../../constants/routes";
import FilterView from "../../containers/home_FilterView";
import SwipeListItem from "../../containers/home_SwipeListItem";

const DUMMY_DATA = [
  {
    id: "1",
    title: "Document 1",
    type: 2,
    date: new Date(),
    status: 2,
  },
  {
    id: "2",
    title: "Document 2",
    type: 0,
    date: new Date(),
    status: 1,
  },
  {
    id: "3",
    title: "Document 3",
    type: 1,
    date: new Date(),
    status: 0,
  },
  {
    id: "4",
    title: "Document 4",
    type: 1,
    date: new Date(),
    status: 0,
  },
  {
    id: "5",
    title: "Document 5",
    type: 1,
    date: new Date(),
    status: 0,
  },
  {
    id: "6",
    title: "Document 6",
    type: 1,
    date: new Date(),
    status: 0,
  },
];

export default function Home() {
  const [filter, setFilter] = useState({
    searchQuery: null,
    sort: 1,
    type: null,
  });
  const [tab, setTab] = useState(0);
  const { finished, finishedId } = useLocalSearchParams();

  useEffect(() => {
    if (finished && finishedId) {
      console.log("Finished", finished, finishedId);
    }
  }, []);

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="docpro"
      urlScheme="docpro"
    >
      <View className="flex-col flex-1 pt-12 bg-white">
        <View className="flex flex-row px-6 mb-8">
          <View className="flex-1">
            <Text twClass="text-tgray text-base">Hello,</Text>
            <Text bold twClass="text-3xl">
              John Doe
            </Text>
          </View>
          <Pressable
            className="p-4 rounded-full bg-softPrimary10"
            onPress={() => router.push(ROUTE_EDIT_USER)}
          >
            <UserRoundPen size={24} color="#63B4FF" />
          </Pressable>
        </View>
        <FilterView filter={filter} setFilter={setFilter} />
        <View className="flex-col flex-1">
          <View className="flex flex-row justify-between px-6 mt-4">
            <Pressable className="" onPress={() => setTab(0)}>
              <Text
                twClass={`text-base ${tab === 0 ? "text-text" : "text-tgray"}`}
              >
                My documents
              </Text>
            </Pressable>
            <Pressable className="" onPress={() => setTab(1)}>
              <Text
                twClass={`text-base ${tab === 1 ? "text-text" : "text-tgray"}`}
              >
                Drafts
              </Text>
            </Pressable>
          </View>
          <View className="flex-1 ">
            <GradientMask intensity={5}>
              <SwipeListView
                showsVerticalScrollIndicator={false}
                className="flex-1 px-6 pt-6"
                data={DUMMY_DATA.filter((item) => {
                  return (
                    (!filter.searchQuery ||
                      item.title
                        .toLowerCase()
                        .includes(filter.searchQuery.toLowerCase())) &&
                    (filter.type === null || item.type === filter.type) &&
                    (tab === 0 ? item.status !== 0 : item.status === 0)
                  );
                }).sort((a, b) => {
                  const statusComparison = a.status - b.status;
                  const dateComparison = filter.sort * (b.date - a.date);
                  return statusComparison !== 0
                    ? statusComparison
                    : dateComparison;
                })}
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
      <FAB
        items={DOCUMENT_TYPES.map((type) => ({
          label: type,
          onPress: (index) => {
            const id = index;
            router.push(`./${id}`);
          },
        }))}
      />
    </StripeProvider>
  );
}
