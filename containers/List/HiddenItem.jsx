import { forwardRef } from "react";
import { Alert, Platform } from "react-native";
import Pressable from "../../components/Pressable";
import Text from "../../components/Text";
import { useList } from "../../providers/list";

const HiddenItem = forwardRef(({ item, tab }, ref) => {
  const { deleteMutation } = useList();
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
        Alert.alert("Delete", "Are you sure you want to delete this draft? ", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            onPress: () => deleteMutation.mutate(item.id),
          },
        ]);
      }}
    >
      <Text twClass="text-white">Delete</Text>
    </Pressable>
  );
});

export default HiddenItem;
