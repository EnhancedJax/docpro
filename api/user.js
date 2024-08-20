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
      count: 6,
      items: [
        {
          id: "1",
          title: "Document 1",
          type: 2,
          date: new Date(),
          status: 2,
        },
        {
          id: "2",
          title: "Document 2",
          type: 0,
          date: new Date(),
          status: 1,
        },
        {
          id: "3",
          title: "Document 3",
          type: 1,
          date: new Date(),
          status: 0,
        },
        {
          id: "4",
          title: "Document 4",
          type: 1,
          date: new Date(),
          status: 0,
        },
        {
          id: "5",
          title: "Document 5",
          type: 1,
          date: new Date(),
          status: 0,
        },
        {
          id: "6",
          title: "Document 6",
          type: 1,
          date: new Date(),
          status: 0,
        },
      ],
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
