import * as yup from "yup";

export const schema = (isSignup) =>
  yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    // 1 uppercase, 1 lowercase, 1 special letter, 8-16 chars length
    password: yup
      .string()
      .matches(
        /^(?=.*\d)(?=.*[-_!@#$%^&?*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/,
        "Password must contain at least 1 uppercase, 1 lowercase, 1 special character, and be 8-16 characters long"
      )
      .required("Password is required"),
    confirmPassword: isSignup
      ? yup
          .string()
          .required("Confirm password is required")
          .oneOf([yup.ref("password")], "Passwords must match")
      : yup.string(),
  });
