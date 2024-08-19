import Text from "./Text";

export default function FieldError({ error }) {
  return (
    <>
      {error && <Text twClass="text-red-500 ml-2 mt-1">{error.message}</Text>}
    </>
  );
}
