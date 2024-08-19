import * as yup from "yup";

export const emailSchema = (value) =>
  yup.object({
    0: yup
      .string()
      .email("Invalid email address")
      .required(`This field is required`)
      .notOneOf([value], "New email must be different from the current one"),
  });

export const requiredSchema = yup.object({
  0: yup.string().required(`This field is required`),
});

export const passwordSchema = yup.object({
  oldPassword: yup.string().required(`This field is required`),
  newPassword: yup
    .string()
    .required(`This field is required`)
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required(`This field is required`)
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
