import { api } from "./index";

export const callGetMe = async () => {
  console.log("callGetMe");
  const { data: responseData } = await api.get(`/user`);
  const { data } = responseData;
  const info = data.info;
  const { editable, completed, paid } = data.userDocs;
  const items = [...editable, ...completed, ...paid];
  const result = {
    email: data?.email || "",
    name: data?.info?.name || "",
    gender: data?.info?.gender || "Male",
    dob: data?.info?.dob || "",
    documents: {
      count: items.length || 0,
      unpaid: completed.length || 0,
      items: items.map((item) => ({
        id: item._id,
        title: item.docName,
        type: {
          id: item.DocTypeId,
          name: item.DocType,
        },
        date: item.editedAt,
        status: editable.includes(item) ? 0 : completed.includes(item) ? 1 : 2,
      })),
    },
  };
  return result;
};

export const callUpdateMe = async ({ key, value }) => {
  console.log("callUpdateMe", key, value);
  const response = await api.patch(`/user`, {
    payload: { [key]: value },
  });
  return response;
};

export const callUpdatePassword = async ({ oldPassword, newPassword }) => {
  console.log("callEditPassword", oldPassword, newPassword);
  return await api.post("/user/forgetPassword", {
    payload: { currentPassword: oldPassword, newPassword: newPassword },
  });
};

export const callUpdateEmail = async ({ newEmail }) => {
  console.log("callUpdateEmail", newEmail);
  return await api.patch("/user/updateEmail", {
    newEmail,
  });
};
