import {
  MutationCache,
  QueryClientProvider as QCP,
  QueryClient,
} from "@tanstack/react-query";
import { useToast } from "../components/toast";

export default function QueryClientProvider({ children }) {
  const { showToast } = useToast();
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        showToast({
          type: "error",
          message: "Something went wrong",
        });
      },
    }),
  });
  return <QCP client={queryClient}>{children}</QCP>;
}
