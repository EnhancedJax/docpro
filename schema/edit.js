import * as yup from "yup";

export const emailSchema = (value) =>
  yup.object({
    0: yup
      .string()
      .email("Invalid email address")
      .required(`This field is required`)
      .notOneOf([value], "New email must be different from the current one"),
  });

export const passwordSchema = yup.object({
  oldPassword: yup.string().required(`This field is required`),
  newPassword: yup
    .string()
    .required(`This field is required`)
    .matches(
      /^(?=.*\d)(?=.*[-_!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 special character, and be 8-16 characters long"
    )
    .min(8, "Password must be at least 8 characters")
    .notOneOf(
      [yup.ref("oldPassword")],
      "New password must be different from the old password"
    ),
  confirmPassword: yup
    .string()
    .required(`This field is required`)
    .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
});
