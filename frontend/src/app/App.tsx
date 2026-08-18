import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "../index.css";
import "@fontsource-variable/inter";
import { ThemeProvider } from "next-themes";
import { Provider as ChakraProvider } from "@/components/ui/provider";
import { UserApi } from "@/api/services/user-service";
import { useEffect } from "react";
import { useAppStore } from "./store";
import { ToastContainer, Slide } from "react-toastify";
import { SocketProvider } from "./providers/SocketProvider";

const queryClient = new QueryClient();

function AppContent() {
  const { data, isPending: isFetchingUser } = useQuery({
    queryKey: ["me"],
    queryFn: UserApi.getMe,
  });

  const setLoading = useAppStore((state) => state.setLoading);
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    if (!isFetchingUser) {
      setUser(data?.content?.user ?? null);
      setLoading(false);
    }
  }, [data, setLoading, isFetchingUser, setUser]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <ChakraProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </ChakraProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
