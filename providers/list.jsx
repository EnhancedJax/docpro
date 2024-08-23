import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { callDeleteDocument } from "../api/document";
import { callGetMe } from "../api/user";
import { useToast } from "../components/toast";

import { usePaymentSheet } from "@stripe/stripe-react-native";
import React, { createContext, useContext } from "react";
import { callNewPayment } from "../api/payment";
import { useLoader } from "../components/loader";
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

  const newPayment = async (documentId) => {
    try {
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
    }
  };

  const openPDFFile = (documentId) => {
    console.log("openPDFFile", documentId);
  };

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
        newPayment(finishedId);
      }
      if (isFinishedPayment) {
        openPDFFile(finishedId);
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
