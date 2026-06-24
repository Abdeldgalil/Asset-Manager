import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import StoryBuddy from "@/pages/StoryBuddy";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <StoryBuddy />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
