import { api } from "./index";

export const callGetDocumentTypes = async () => {
  console.log("callGetDocumentTypes");
  const response = await api.get("/documentType");
  const result = response?.data?.items;
  if (!result) {
    return [];
  }
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

export const callUpdateDocument = async (id, name, data, isFinished) => {
  console.log("callUpdateDocument", id, name, data, isFinished);
  const response = await api.put(`/userDocument/${id}`, {
    docName: name,
    finished: isFinished,
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

export const callGetDocumentBuffer = async (id) => {
  console.log("callGetDocumentBuffer", id);
  return await api.get(`/userDocument/download/?docId=${id}`);
};

export const callGetDocumentUrl = async (id) => {
  console.log("callGetDocumentUrl", id);
  const response = await api.get(`/userDocument/download/?docId=${id}`);
  const url = response.data.url;
  return "https://pdfobject.com/pdf/sample.pdf";
};
