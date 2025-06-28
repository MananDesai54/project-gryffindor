import { Toaster } from "@gryffindor/client/components/ui/sonner";
import AppRouterProvider from "@gryffindor/client/route/routeConfig";
import Layout from "./components/app/layout";

function App() {
  return (
    <Layout>
      <AppRouterProvider />
      <Toaster />
    </Layout>
  );
}

export default App;
