export const callGetMe = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    id: "123",
    email: "test@test.com",
    name: "hs",
  };

  if (response.id) {
    return response;
  }
  throw new Error("An error has occurred");
};

export const callUpdateUser = async () => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  return true;
};
