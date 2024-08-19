import { WebView } from "react-native-webview";

export default function PDFViewer() {
  return (
    <WebView
      className="flex-1"
      source={{ uri: "https://pdfobject.com/pdf/sample.pdf" }}
    />
  );
}
