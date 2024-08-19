// export const callLoginUser = (credentials) => api.post("/login", credentials);
// export const callSignupUser = (userData) => api.post("/signup", userData);
// export const callLogoutUser = () => api.post("/logout");
// export const callRefreshToken = () => api.post("/refresh-token");

export const callLoginUser = async (data) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  const response = {
    accessToken: "ABC",
    refreshToken: "DEF",
  };

  if (response.accessToken) {
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
    accessToken: "ABC",
    refreshToken: "DEF",
  };

  if (response.accessToken) {
    return response;
  } else {
    throw new Error("Signup failed");
  }
};

export const callLogoutUser = async (data) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  return {
    message: "Logout successful",
  };
};

export const callRefreshToken = async (data) => {
  // Simulating API call with a timeout
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Dummy response
  return {
    accessToken: "ABC",
  };
};
