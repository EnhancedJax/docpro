import { api } from "./index";

export const callGetDocumentTypes = async () => {
  console.log("callGetDocumentTypes");
  const response = await api.get("/documentType");
  const result = response.data.items;
  return result;
};

export const callGetDocument = async (id) => {
  console.log("callGetDocument", id);
  const response = await api.get(`/userDocument/?docId=${id}`);
  const data = response.data.data;
  const result = {
    id: data._id,
    name: data.docName || "",
    answers: data?.payload?.userAnswers || [],
    questions: data?.questions || [],
  };
  return result;
};

export const callUpdateDocument = async (id, name, data) => {
  console.log("callUpdateDocument", id, name, data);
  const response = await api.put(`/userDocument/${id}`, {
    docName: name,
    payload: {
      userAnswers: data,
    },
  });
  return response.data.data;
};

export const callCreateDocument = async ({ documentTypeId }) => {
  console.log("callCreateDocument", documentTypeId);
  const response = await api.post("/userDocument", {
    payload: {
      DocumentTypeId: documentTypeId,
      documentName: "",
      userAnswers: [],
    },
  });
  const id = response.data.data._id;
  return { id };
};

export const callDeleteDocument = async (id) => {
  console.log("callDeleteDocument", id);
  const response = await api.delete(`/userDocument/${id}`);
  return response;
};
