import * as yup from "yup";

export const generateSchema = (questionItem) => {
  const generatedSchema = yup.object().shape(
    questionItem.reduce((acc, question, index) => {
      switch (question.type) {
        case "text":
        case "textarea":
          acc[index] = yup
            .string()
            .min(question.min, `Minimum ${question.min} characters`)
            .max(question.max, `Maximum ${question.max} characters`)
            .required("This field is required");
          break;
        case "checkbox":
          acc[index] = yup
            .array()
            .of(yup.string())
            .min(question.min, `Select at least ${question.min} option(s)`)
            .max(question.max, `Select at most ${question.max} option(s)`)
            .required("This field is required");
          break;
        case "radio":
          acc[index] = yup
            .string()
            .oneOf(question.options, "Invalid option")
            .required("This field is required");
          break;
        case "date":
          acc[index] = yup
            .date()
            .min(
              question.min,
              `Date must be after ${question.min.toDateString()}`
            )
            .max(
              question.max,
              `Date must be before ${question.max.toDateString()}`
            )
            .required("This field is required");
          break;
        case "number":
          acc[index] = yup
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
