import { StripeProvider } from "@stripe/stripe-react-native";
import { UserRoundPen } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import FAB from "../../../components/Fab";
import GradientMask from "../../../components/GradientMask";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import { DOCUMENT_TYPES } from "../../../constants";
import FilterView from "../../../containers/home_FilterView";
import SwipeListItem from "../../../containers/home_SwipeListItem";
import { useAuthContext } from "../../../providers/auth";

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
  const { logout } = useAuthContext();
  const [filter, setFilter] = useState({
    searchQuery: null,
    sort: 1,
    type: null,
  });

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="docpro"
      urlScheme="docpro"
    >
      <View className="flex-1 py-12 bg-white ">
        <View className="flex flex-row px-6 mb-8">
          <View className="flex-1">
            <Text twClass="text-tgray text-base">Hello,</Text>
            <Text bold twClass="text-3xl">
              John Doe
            </Text>
          </View>
          <Pressable
            className="p-4 rounded-full bg-softPrimary10"
            onPress={logout}
          >
            <UserRoundPen size={24} color="#63B4FF" />
          </Pressable>
        </View>
        <FilterView filter={filter} setFilter={setFilter} />
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
                (filter.type === null || item.type === filter.type)
              );
            })}
            renderItem={({ item }) => <SwipeListItem item={item} />}
            renderHiddenItem={({ item }) => (
              <Pressable
                className="items-end justify-center flex-1 pr-4 mb-4 ml-10 bg-red-500 rounded-xl"
                onPress={() => {
                  console.log("Deleting item", item.id);
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
      <FAB
        items={DOCUMENT_TYPES.map((type) => ({
          label: type,
          onPress: () => {},
        }))}
      />
    </StripeProvider>
  );
}
