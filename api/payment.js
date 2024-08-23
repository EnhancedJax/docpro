import { api } from "./index";

export const callNewPayment = async (id) => {
  console.log("callNewPayment");
  const response = await api.post(`/payment/${id}`);
  return response.data;
};

export const callPaymentStatus = async (paymentIntentId) => {
  console.log("callPaymentStatus", paymentIntentId);
  const response = await api.get(
    `/payment/?paymentIntentId=${paymentIntentId}`
  );
  return response.data;
};
