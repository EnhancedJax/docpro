export const callGetDocumentTypes = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    count: 3,
    items: [
      {
        name: "Advanced Medical Directive",
        description:
          "A document that allows you to specify your medical wishes in case you are unable to communicate them yourself.",
      },
      {
        name: "Enduring Power of Attorney",
        description:
          "A document that allows you to appoint an attorney to make decisions for you in case you are unable to do so yourself.",
      },
      {
        name: "Will",
        description:
          "A document that allows you to specify your wishes for your estate in case you are unable to communicate them yourself.",
      },
    ],
  };

  if (response) {
    return response;
  } else {
    throw new Error("Request failed");
  }
};
