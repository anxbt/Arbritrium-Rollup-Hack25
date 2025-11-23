import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Bridge from "./pages/Bridge";
import HowItWorks from "./pages/HowItWorks";
import Status from "./pages/Status";
import Success from "./pages/Success";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Error from "./pages/Error";

const App = () => (
  <Web3Provider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bridge" element={<Bridge />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/status/:txId" element={<Status />} />
          <Route path="/success" element={<Success />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/error" element={<Error />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </Web3Provider>
);

export default App;
