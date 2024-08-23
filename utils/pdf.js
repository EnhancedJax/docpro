import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export async function saveAndGetUri(buffer) {
  const buff = Buffer.from(buffer, "base64").toString("base64");
  const fileUri = FileSystem.documentDirectory + "document.pdf";
  await FileSystem.writeAsStringAsync(fileUri, buff, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
}

export async function savePDF(fileUri) {
  if (Platform.OS === "android") {
    // const permissions =
    //   await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    // if (permissions.granted) {
    //   const base64 = await FileSystem.readAsStringAsync(fileUri, {
    //     encoding: FileSystem.EncodingType.Base64,
    //   });

    //   const uri = await FileSystem.StorageAccessFramework.createFileAsync(
    //     permissions.directoryUri,
    //     "document.pdf",
    //     "application/pdf"
    //   );

    //   await FileSystem.writeAsStringAsync(uri, base64, {
    //     encoding: FileSystem.EncodingType.Base64,
    //   });
    // } else {
    //   console.log("permissions not granted");
    //   await Sharing.shareAsync(fileUri, {
    //     UTI: ".pdf",
    //     mimeType: "application/pdf",
    //   });
    // }
    const response = await FileSystem.getContentUriAsync(fileUri);
    console.log("1", response);
    const response2 = await IntentLauncher.startActivityAsync(
      "android.intent.action.VIEW",
      {
        data: response,
        flags: 1,
      }
    );
    console.log("2", response2);
  } else {
    await Sharing.shareAsync(fileUri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  }
}
