import { ClockArrowDown, ClockArrowUp, Search } from "lucide-react-native";
import { ScrollView, TextInput, View } from "react-native";
import Pressable from "../components/Pressable";
import Text from "../components/Text";
import { DOCUMENT_TYPES } from "../constants";

export default function FilterView({ filter, setFilter }) {
  return (
    <View className="px-6">
      <View className="flex flex-row mb-3">
        <TextInput
          placeholder="Search"
          className="flex-1 p-4 text-base rounded-2xl pl-14 bg-gray text-tgray"
          placeholderTextColor="#8696BB"
          value={filter.searchQuery}
          onChangeText={(text) => setFilter({ ...filter, searchQuery: text })}
        />
        <View className="absolute left-4 top-4">
          <Search size={24} color="#8696BB" />
        </View>
        <Pressable
          className="p-4 ml-2 bg-gray rounded-2xl"
          onPress={() => setFilter({ ...filter, sort: filter.sort * -1 })}
        >
          {filter.sort === 1 ? (
            <ClockArrowDown size={24} color="#8696BB" />
          ) : (
            <ClockArrowUp size={24} color="#8696BB" />
          )}
        </Pressable>
      </View>
      <ScrollView
        horizontal
        className="flex flex-row"
        style={{
          overflow: "visible",
        }}
        showsHorizontalScrollIndicator={false}
      >
        {DOCUMENT_TYPES.map((type, index) => (
          <Pressable
            key={type}
            className={`px-4 py-3 mr-2 bg-gray rounded-2xl ${
              index === filter.type ? "bg-softPrimary10" : ""
            }`}
            onPress={() => {
              if (index === filter.type) {
                setFilter({ ...filter, type: null });
              } else {
                setFilter({ ...filter, type: index });
              }
            }}
          >
            <Text
              twClass={`text-tgray ${
                index === filter.type ? "text-softPrimary" : ""
              }`}
            >
              {type}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
