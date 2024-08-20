import * as yup from "yup";

export const schema = (isSignup) =>
  yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: isSignup
      ? yup
          .string()
          .required("Confirm password is required")
          .oneOf([yup.ref("password")], "Passwords must match")
      : yup.string(),
  });

// export const schema = (isSignup) =>
//   yup.object({
//     email: yup.string(),
//     password: yup.string(),
//     confirmPassword: yup.string(),
//   });
