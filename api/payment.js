export const callNewPayment = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  return {
    data: {
      paymentIntentClientSecret: "cs_00000",
      customerEphemeralKeySecret: "ek_00000",
      customerId: "cus_00000",
    },
  };
};

// export const callNewPayment = (documentId) => api.post("/payment", documentId);
