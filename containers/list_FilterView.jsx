import { useQuery } from "@tanstack/react-query";
import { ClockArrowDown, ClockArrowUp, Search } from "lucide-react-native";
import { ScrollView, View } from "react-native";
import { callGetDocumentTypes } from "../api/document";
import Input from "../components/Input";
import Pressable from "../components/Pressable";
import Text from "../components/Text";
import Loader from "../components/loader";
import Colors from "../constants/color";

export default function FilterView({ filter, setFilter }) {
  const { data: documentTypes = {}, isFetched } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: callGetDocumentTypes,
  });

  if (!isFetched) {
    return <Loader />;
  }

  return (
    <View className="px-6">
      <View className="flex flex-row mb-3">
        <Input
          type="bare"
          placeholder="Search"
          twClass="flex-1 rounded-full pl-12 text-tgray bg-gray"
          placeholderTextColor={Colors.tgray}
          value={filter.searchQuery}
          onChangeText={(text) => setFilter({ ...filter, searchQuery: text })}
        />
        <View className="absolute left-4 top-4">
          <Search size={24} color={Colors.tgray} />
        </View>
        <Pressable
          className="p-4 ml-2 rounded-full bg-gray"
          onPress={() => setFilter({ ...filter, sort: filter.sort * -1 })}
        >
          {filter.sort === 1 ? (
            <ClockArrowDown size={24} color={Colors.tgray} />
          ) : (
            <ClockArrowUp size={24} color={Colors.tgray} />
          )}
        </Pressable>
      </View>
      <ScrollView
        horizontal
        className="flex flex-row "
        style={{
          overflow: "visible",
        }}
        showsHorizontalScrollIndicator={false}
      >
        {documentTypes?.items &&
          documentTypes?.items?.map((type, index) => (
            <Pressable
              key={`${type.name}-${index}`}
              className={`px-4 py-3 mr-2 bg-gray rounded-full ${
                index === filter.type ? "bg-secondary10" : ""
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
                  index === filter.type ? "text-secondary" : ""
                }`}
              >
                {type.name}
              </Text>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}
