import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";

export async function saveAndGetUri(buffer) {
  const buff = Buffer.from(buffer, "base64").toString("base64");
  const fileUri = FileSystem.documentDirectory + "document.pdf";
  await FileSystem.writeAsStringAsync(fileUri, buff, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}
