import { usePaymentSheet } from "@stripe/stripe-react-native";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Clock, HandCoins, StepForward } from "lucide-react-native";
import { Platform, View } from "react-native";
import { callNewPayment } from "../api/payment";
import { useLoader } from "../components/loader";
import Pressable from "../components/Pressable";
import Text from "../components/Text";
import { useToast } from "../components/toast";
import Colors from "../constants/color";
import { ROUTE_TEMPLATE } from "../constants/routes";

export default function SwipeListItem({ item }) {
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const { showLoader, hideLoader } = useLoader();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return (
    <Pressable
      className={`py-5 mb-4 bg-white  ${
        Platform.OS === "ios"
          ? "shadow-lg rounded-lg"
          : "border border-neutral-200 rounded-2xl"
      }`}
      onPress={async () => {
        switch (item.status) {
          case 0: // DRAFT
            router.push({ pathname: ROUTE_TEMPLATE, params: { id: item.id } });
            break;
          case 1: // PENDING PAYMENT
            try {
              showLoader();
              const data = await queryClient.fetchQuery({
                queryKey: ["newPayment", item.id],
                queryFn: () => callNewPayment(item.id),
              });

              const { error } = await initPaymentSheet({
                ...data?.data,
                merchantDisplayName: "DocPro",
                returnURL: "docpro://stripe-redirect",
              });
              if (error) throw new Error(error.message);
              hideLoader();

              await new Promise((resolve) => setTimeout(resolve, 1000));

              const errors = await presentPaymentSheet();
              if (errors) throw new Error(errors["error"]["message"]);
            } catch (error) {
              showToast({ message: error.message });
              console.log(error.message);
            } finally {
              hideLoader();
            }
            break;
          case 2: // COMPLETED
            // const url = "https://pdfobject.com/pdf/sample.pdf";
            // if (Platform.OS === "ios") {
            //   WebBrowser.dismissBrowser();
            //   WebBrowser.openBrowserAsync(url);
            // } else {
            //   IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
            //     type: "application/pdf",
            //     data: url,
            //   });
            // }
            break;
        }
      }}
    >
      <View className="flex flex-row items-center">
        <View className="flex-1 ml-4">
          {item.status !== 2 && (
            <View
              className={`self-start flex-none mb-3 rounded-full ${
                item.status === 0 ? "bg-secondary10" : "bg-payment10 "
              }`}
            >
              <Text
                twClass={`text-xs px-2 py-1 ${
                  item.status === 0 ? "text-secondary" : "text-payment"
                }`}
              >
                {item.status === 0 ? "Draft" : "Pending payment"}
              </Text>
            </View>
          )}
          <View className="mb-3">
            <Text twClass="text-base">{item.title}</Text>
            <Text twClass="text-tgray text-sm">
              {item.type.name || "No type"}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Clock size={16} color={Colors.tgray} />
            <Text twClass="text-tgray text-sm ml-2">
              {(() => {
                const now = new Date();
                const itemDate = new Date(item?.date);
                const diffInMinutes = (now - itemDate) / (1000 * 60);

                if (diffInMinutes < 5) {
                  return "Just Now";
                } else if (itemDate.getDate() === now.getDate() - 1) {
                  return (
                    "Yesterday at " +
                    itemDate.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  );
                } else {
                  return itemDate.toLocaleString([], {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }
              })()}
            </Text>
          </View>
        </View>
        {item.status !== 2 && (
          <View
            className={`p-3 mr-4 rounded-full ${
              item.status === 0 ? "bg-secondary" : "bg-payment"
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
