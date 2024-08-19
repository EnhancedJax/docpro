import { useQueryClient } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { callGetMe } from "../api/user";
import { ROUTE_HOME, ROUTE_LIST, ROUTE_LOGIN } from "../constants/routes";
import { useAuth } from "../providers/auth";

export default function Index() {
  const { accessToken } = useAuth();
  const [authState, setAuthState] = useState({
    hasDocuments: false,
    isLoading: true,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const init = async () => {
      try {
        const meData = await queryClient.fetchQuery({
          queryKey: ["me"],
          queryFn: callGetMe,
        });

        setAuthState({
          isLoading: false,
          hasDocuments: meData?.documents.count > 0,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthState({ isLoading: false, hasDocuments: false });
      } finally {
      }
    };

    if (accessToken === 0) return;
    if (accessToken) {
      init();
    } else {
      setAuthState({ isLoading: false, hasDocuments: false });
    }
  }, [accessToken]);

  if (authState.isLoading) {
    return null;
  }

  if (!accessToken) {
    return <Redirect href={ROUTE_LOGIN} />;
  }

  if (authState.hasDocuments) {
    return <Redirect href={ROUTE_LIST} />;
  }

  return <Redirect href={ROUTE_HOME} />;
}
