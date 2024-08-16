import {
  MutationCache,
  QueryClientProvider as QCP,
  QueryClient,
} from "@tanstack/react-query";
import { useLoader } from "../components/loader";
import { useToast } from "../components/toast";

export default function QueryClientProvider({ children }) {
  const { showToast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        showToast({
          type: "error",
          message: error.message,
        });
      },
      onMutate: (mutation) => {
        showLoader();
      },
      onSettled: (mutation) => {
        hideLoader();
      },
    }),
  });
  return <QCP client={queryClient}>{children}</QCP>;
}
