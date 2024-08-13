export const callLoginUser = async (data) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    token: "ABC",
  };

  if (response.token) {
    return response;
  } else {
    throw new Error("Login failed");
  }
};

export const callSignupUser = async (data) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    token: "ABC",
  };

  if (response.token) {
    return response;
  } else {
    throw new Error("Signup failed");
  }
};
