export const FIELDS = [
  {
    question: "What's your name?",
    type: "text",
    displayName: "Name",
    key: "name",
    min: 1,
    max: 100,
  },
  {
    question: "What's your date of birth?",
    type: "date",
    displayName: "Date of Birth",
    key: "dob",
    min: "1900-01-01",
    max: new Date().toISOString().split("T")[0],
  },
  {
    question: "What's your gender?",
    type: "radio",
    options: ["Male", "Female", "Other"],
    displayName: "Gender",
    key: "gender",
  },
];

export const EMAIL_FIELD = {
  question: "What's your email?",
  type: "text",
  displayName: "Email",
  key: "email",
};
