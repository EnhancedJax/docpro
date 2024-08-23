import { StripeProvider } from "@stripe/stripe-react-native";
import { Check, NotepadTextDashed, Squirrel } from "lucide-react-native";
import { View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import GradientMask from "../../../components/GradientMask";
import Pressable from "../../../components/Pressable";
import Text from "../../../components/Text";
import Colors from "../../../constants/color";
import FilterView from "../../../containers/List/FilterView";
import HiddenItem from "../../../containers/List/HiddenItem";
import SwipeListItem from "../../../containers/List/SwipeListItem";
import { useList, withListProvider } from "../../../providers/list";

function List() {
  const { filter, tab, setTab, data } = useList();

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PK}
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
        <FilterView />
        <View className="flex flex-row flex-1 pb-6">
          <GradientMask intensity={5}>
            <SwipeListView
              showsVerticalScrollIndicator={false}
              className="flex-1 px-6 pt-6"
              contentContainerStyle={{ paddingBottom: 100 }}
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
                <HiddenItem item={item} tab={tab} />
              )}
              rightOpenValue={-75}
              disableLeftSwipe={tab === "finished"}
              disableRightSwipe
              keyExtractor={(item) => item.id}
            />
          </GradientMask>
        </View>
      </View>
    </StripeProvider>
  );
}

export default withListProvider(List);
