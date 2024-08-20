export const callGetDocumentTypes = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    count: 3,
    items: [
      {
        id: "1",
        name: "Advanced Medical Directive",
        description:
          "A document that allows you to specify your medical wishes in case you are unable to communicate them yourself.",
      },
      {
        id: "2",
        name: "Enduring Power of Attorney",
        description:
          "A document that allows you to appoint an attorney to make decisions for you in case you are unable to do so yourself.",
      },
      {
        id: "3",
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

export const callGetDocumentQuestions = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    count: 5,
    items: [
      {
        question: "Please select types of documents you have",
        description: "This is a description",
        type: "checkbox",
        options: ["A", "B", "C"],
        min: 1,
        max: 3,
      },
      {
        question: "What is your permanent address?",
        description: "This is a description",
        type: "textarea",
        placeholder: "Enter your address",
        min: 1,
        max: 40,
      },
      // {
      //   question: "When did your term start?",
      //   description: "This is a description",
      //   type: "date",
      //   min: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      //   max: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      // },
      // {
      //   question: "Are you a permanent resident of Hong Kong?",
      //   description: "This is a description",
      //   type: "radio",
      //   options: ["Yes", "No"],
      // },
      // {
      //   question: "What is your monthly income?",
      //   description: "This is a description",
      //   type: "number",
      //   placeholder: "Enter your monthly income",
      //   min: 1,
      //   max: 1000000,
      // },
    ],
  };

  if (response) {
    return response;
  } else {
    throw new Error("Request failed");
  }
};

export const callUpdateDocument = async (id, name, data) => {
  // Simulating API call with a timeout
  console.log(id, name, data);
  await new Promise((resolve) => setTimeout(resolve, 100));
  return data;
};

export const callCreateDocument = async (documentTypeId) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { id: new Date().getTime().toString() };
};

export const callGetDocument = async (id) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    id: id,
    name: null,
    type: 1,
    data: [],
  };
};

// export const callGetDocumentTypes = () => api.get("/documentTypes");
// export const callGetDocumentQuestions = (id) => api.get(`/documentTypes/${id}`);
// export const callGetDocument = (id) => api.get(`/documents/${id}`);
// export const callCreateDocument = (documentTypeId) =>
//   api.post("/documents", { documentTypeId });
// export const callUpdateDocument = (id, name, data) =>
//   api.put(`/documents/${id}`, { name, data });
export const callDeleteDocument = (id) => api.delete(`/documents/${id}`);
