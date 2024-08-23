import { usePaymentSheet } from "@stripe/stripe-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { callDeleteDocument } from "../api/document";
import { callNewPayment } from "../api/payment";
import { callGetMe } from "../api/user";
import { useLoader } from "../components/loader";
import { useToast } from "../components/toast";
import { ROUTE_LISTEN } from "../constants/routes";

const ListContext = createContext();
export const useList = () => useContext(ListContext);

function ListProvider({ children }) {
  const [filter, setFilter] = useState({
    searchQuery: null,
    sort: 1,
    type: null,
  });
  const { showToast } = useToast();
  const { finished, finishedId } = useLocalSearchParams();
  const [tab, setTab] = useState("finished");
  const queryClient = useQueryClient();
  const { showLoader, hideLoader } = useLoader();
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
  const { data = {}, isFetched } = useQuery({
    queryKey: ["me"],
    queryFn: callGetMe,
  });
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  //#region APIs

  const deleteMutation = useMutation({
    mutationFn: callDeleteDocument,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      showToast({
        message: "Document deleted",
        type: "success",
      });
    },
  });

  //#region Callbacks

  const newPayment = async (documentId) => {
    if (paymentInProgress) return;
    try {
      setPaymentInProgress(true);
      showLoader();
      const data = await queryClient.fetchQuery({
        queryKey: ["newPayment", documentId],
        queryFn: () => callNewPayment(documentId),
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
      const errorMessage = errors?.error?.message;
      if (errorMessage) throw new Error(errorMessage);
      const paymentIntentClientSecret = data?.data?.paymentIntentClientSecret;
      const paymentIntentId = paymentIntentClientSecret.split("_secret_")[0];
      router.replace({
        pathname: ROUTE_LISTEN,
        params: { documentId, paymentIntentId },
      });
    } catch (error) {
      showToast({ message: error.message });
      console.log(error.message);
    } finally {
      hideLoader();
      setPaymentInProgress(false);
    }
  };

  const openPDFFile = (documentId, showPopup = false) => {
    console.log("openPDFFile", documentId);
    const url = "https://pdfobject.com/pdf/sample.pdf";

    const openPDF = async () => {
      if (Platform.OS === "ios") {
        WebBrowser.dismissBrowser();
        WebBrowser.openBrowserAsync(url);
      } else {
        await Linking.openURL(url);
      }
    };

    if (showPopup) {
      Alert.alert("Payment success!", "Do you want to view the PDF file now?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open",
          onPress: openPDF,
        },
      ]);
    } else {
      openPDF();
    }
  };

  const resetFilters = () => {
    setFilter({
      searchQuery: null,
      sort: 1,
      type: null,
    });
  };

  //#region useEffects

  useEffect(() => {
    showLoader();
  }, []);

  useEffect(() => {
    if (!isFetched) return;
    hideLoader();
    if (finished === undefined) {
      // no finish callback: check if user have any finished documents, if not set tab to drafts
      if (
        data.documents.items.filter((item) => item.status !== 0).length === 0
      ) {
        setTab("drafts");
      }
    } else {
      // with finish callback: set tab to finished or drafts based on the callback
      const isFinishedDocument = finished === "document";
      const isFinishedPayment = finished === "payment";
      setTab(isFinishedDocument || isFinishedPayment ? "finished" : "drafts"); // if finished is payment, it will be redirect to finished
      if (isFinishedDocument) {
        resetFilters();
        newPayment(finishedId);
      }
      if (isFinishedPayment) {
        openPDFFile(finishedId, true);
      }
    }
  }, [finished, finishedId, isFetched]);

  if (!isFetched) return null;

  return (
    <ListContext.Provider
      value={{
        filter,
        setFilter,
        tab,
        setTab,
        deleteMutation,
        data,
        isFetched,
        newPayment,
        openPDFFile,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}

export const withListProvider = (Component) => (props) =>
  (
    <ListProvider {...props}>
      <Component {...props} />
    </ListProvider>
  );
