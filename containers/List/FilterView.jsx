import { useQuery } from "@tanstack/react-query";
import { ClockArrowDown, ClockArrowUp, Search } from "lucide-react-native";
import { View } from "react-native";
import { callGetDocumentTypes } from "../../api/document";
import ButtonedScrollView from "../../components/ButtonedScrollView";
import Input from "../../components/Input";
import Pressable from "../../components/Pressable";
import Text from "../../components/Text";
import Colors from "../../constants/color";
import { useList } from "../../providers/list";

export default function FilterView() {
  const { filter, setFilter } = useList();
  const { data: documentTypes = {}, isFetched } = useQuery({
    queryKey: ["documentTypes"],
    queryFn: callGetDocumentTypes,
  });

  if (!isFetched) {
    return null;
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
          onPress={() => setFilter({ ...filter, sort: filter.sort * -1 })}
        >
          <View className="flex items-center justify-center p-4 ml-2 rounded-full bg-gray">
            {filter.sort === 1 ? (
              <ClockArrowDown size={24} color={Colors.tgray} />
            ) : (
              <ClockArrowUp size={24} color={Colors.tgray} />
            )}
          </View>
        </Pressable>
      </View>
      <ButtonedScrollView arrowOffset={-24}>
        {documentTypes &&
          documentTypes?.map((type, index) => (
            <Pressable
              key={`${type.name}-${index}`}
              className={`px-4 py-3 mr-2 bg-gray rounded-full ${
                type._id === filter.type ? "bg-secondary10" : ""
              }`}
              onPress={() => {
                if (type._id === filter.type) {
                  setFilter({ ...filter, type: null });
                } else {
                  setFilter({ ...filter, type: type._id });
                }
              }}
            >
              <Text
                twClass={`text-tgray ${
                  type._id === filter.type ? "text-secondary" : ""
                }`}
              >
                {type.name}
              </Text>
            </Pressable>
          ))}
      </ButtonedScrollView>
    </View>
  );
}
