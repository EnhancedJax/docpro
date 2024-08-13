import {
  ClockArrowDown,
  ClockArrowUp,
  Search,
  UserRoundPen,
} from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import FAB from "../../components/Fab";
import Text from "../../components/Text";
import { DOCUMENT_TYPES } from "../../constants";
import { useAuthContext } from "../../providers/auth";

export default function Home() {
  const { logout } = useAuthContext();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(1);

  return (
    <>
      <View className="flex-1 px-6 py-12 bg-white">
        <View className="flex flex-row mb-8">
          <View className="flex-1">
            <Text twClass="text-tgray text-base">Hello,</Text>
            <Text bold twClass="text-3xl">
              John Doe
            </Text>
          </View>
          <Pressable className="p-4 rounded-full bg-softPrimary10">
            <UserRoundPen size={24} color="#63B4FF" />
          </Pressable>
        </View>
        <View className="mb-8 ">
          <View className="flex flex-row mb-3">
            <TextInput
              placeholder="Search"
              className="flex-1 p-4 text-base rounded-2xl pl-14 bg-gray text-tgray"
              placeholderTextColor="#8696BB"
              value={search}
              onChangeText={setSearch}
            />
            <View className="absolute left-4 top-4">
              <Search size={24} color="#8696BB" />
            </View>
            <Pressable
              className="p-4 ml-2 bg-gray rounded-2xl"
              onPress={() => setSort((prev) => prev * -1)}
            >
              {sort === 1 ? (
                <ClockArrowDown size={24} color="#8696BB" />
              ) : (
                <ClockArrowUp size={24} color="#8696BB" />
              )}
            </Pressable>
          </View>
          <View className="flex flex-row">
            {DOCUMENT_TYPES.map((type) => (
              <Pressable
                key={type}
                className="px-4 py-3 mr-2 bg-gray rounded-2xl"
              >
                <Text twClass="text-tgray">{type}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <ScrollView className="flex-1 "></ScrollView>
      </View>
      <FAB
        items={DOCUMENT_TYPES.map((type) => ({
          label: type,
          onPress: () => {},
        }))}
      />
    </>
  );
}
