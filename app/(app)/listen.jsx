import { useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { LoaderPinwheel } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { callPaymentStatus } from "../../api/payment";
import Text from "../../components/Text";
import { useToast } from "../../components/Toast/provider";
import Colors from "../../constants/color";
import { ROUTE_LIST } from "../../constants/routes";
// import PDFViewer from "../../components/PDFViewer";

export default function Listen() {
  const { documentId, paymentIntentId } = useLocalSearchParams();
  const { showToast } = useToast();
  const [count, setCount] = useState(0);
  const queryClient = useQueryClient();
  const { data, refetch, isLoading, isFetching } = useQuery({
    queryKey: ["payment", paymentIntentId],
    queryFn: () => callPaymentStatus(paymentIntentId),
  });

  useEffect(() => {
    const status = data?.data?.status;
    if (!status) return;
    console.log("Payment status:", status);
    if (count > 10) {
      showToast({
        message: "Transaction failed, please try again",
        type: "error",
      });
      router.replace(ROUTE_LIST);
    }
    if (status === "succeeded") {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      showToast({
        message: "Transaction success!",
        type: "success",
      });
      router.replace({
        pathname: ROUTE_LIST,
        params: {
          finished: "payment",
          finishedId: documentId,
        },
      });
    } else if (!isLoading && !isFetching) {
      setTimeout(() => {
        refetch();
        setCount(count + 1);
      }, 1000 + 100 * count);
    }
  }, [data, isLoading, isFetching, refetch]);

  return (
    <View className="flex items-center justify-center flex-1 bg-white">
      <LoaderPinwheel size={48} color={Colors.text} />
      <Text twClass="mt-4 text-lg text-text">Transaction in progress...</Text>
    </View>
  );
}
