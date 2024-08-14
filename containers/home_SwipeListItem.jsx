import { Clock, HandCoins, StepForward } from "lucide-react-native";
import { View } from "react-native";
import Pressable from "../components/Pressable";
import Text from "../components/Text";
import { DOCUMENT_TYPES } from "../constants";
import Colors from "../constants/color";

export default function SwipeListItem({ item }) {
  return (
    <Pressable
      className="py-5 mb-4 bg-white rounded-lg shadow-md"
      onPress={() => {
        console.log(item);
      }}
    >
      <View className="flex flex-row items-center">
        <View className="flex-1 ml-4">
          {item.status !== 2 && (
            <View
              className={`self-start flex-none mb-3 rounded-full ${
                item.status === 0 ? "bg-softPrimary10" : "bg-payment10 "
              }`}
            >
              <Text
                twClass={`text-xs px-2 py-1 ${
                  item.status === 0 ? "text-softPrimary" : "text-payment"
                }`}
              >
                {item.status === 0 ? "Draft" : "Pending payment"}
              </Text>
            </View>
          )}
          <View className="mb-3">
            <Text twClass="text-base">{item.title}</Text>
            <Text twClass="text-tgray text-sm">
              {DOCUMENT_TYPES[item.type]}
            </Text>
          </View>
          <View className="flex flex-row">
            <Clock size={16} color={Colors.tgray} />
            <Text twClass="text-tgray text-sm ml-2">
              {item?.date?.toLocaleDateString()}
            </Text>
          </View>
        </View>
        {item.status !== 2 && (
          <View
            className={`p-3 mr-4 rounded-full ${
              item.status === 0 ? "bg-softPrimary" : "bg-payment"
            }`}
          >
            {item.status === 0 ? (
              <StepForward size={20} color="white" />
            ) : (
              <HandCoins size={20} color="white" />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}
