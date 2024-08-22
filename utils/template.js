import * as yup from "yup";

export const generateSchema = (questionItem) => {
  const generatedSchema = yup.object().shape(
    questionItem.reduce((acc, question, index) => {
      const key = question.key || index;
      switch (question.type) {
        case "text":
        case "textarea":
          acc[key] = yup
            .string()
            .min(question.min, `Minimum ${question.min} characters`)
            .max(question.max, `Maximum ${question.max} characters`)
            .required("This field is required");
          break;
        case "checkbox":
          acc[key] = yup
            .array()
            .of(yup.string())
            .min(question.min, `Select at least ${question.min} option(s)`)
            .max(question.max, `Select at most ${question.max} option(s)`)
            .required("This field is required");
          break;
        case "radio":
          acc[key] = yup
            .string()
            .oneOf(question.options, "Invalid option")
            .required("This field is required");
          break;
        case "date":
          acc[key] = yup
            .string()
            .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
            .test(
              "min-date",
              `Date must be after ${question.min}`,
              function (value) {
                return !question.min || value >= question.min;
              }
            )
            .test(
              "max-date",
              `Date must be before ${question.max}`,
              function (value) {
                return !question.max || value <= question.max;
              }
            )
            .required("This field is required");
          break;
        case "number":
          acc[key] = yup
            .number()
            .typeError("Please enter a number")
            .min(question.min, `Minimum value is ${question.min}`)
            .max(question.max, `Maximum value is ${question.max}`)
            .required("This field is required");
          break;
      }
      return acc;
    }, {})
  );
  return generatedSchema;
};
