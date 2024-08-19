export const callGetMe = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    id: "123",
    email: "test@test.com",
    name: "hs",
    gender: "male",
    dob: "1990-01-01",
    documents: {
      count: 0,
      items: [],
    },
  };

  if (response.id) {
    return response;
  }
  throw new Error("An error has occurred");
};

export const callUpdateMe = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  return true;
};

export const callUpdatePassword = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  throw new Error("Password does not match");
};
