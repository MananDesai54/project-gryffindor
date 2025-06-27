import { Toaster } from "@/components/ui/sonner";
import AppRouterProvider from "@/routes/routeConfig";

function App() {
  return (
    <div className="h-screen bg-secondary">
      <AppRouterProvider></AppRouterProvider>
      <Toaster />
    </div>
  );
}

export default App;
