import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PDFEditor from "./components/PDFEditor";
import PDFMerger from "./components/PDFMerger";
import PDFSplitter from "./components/PDFSplitter";
import PDFCompressor from "./components/PDFCompressor";
import PDFConverter from "./components/PDFConverter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/edit-pdf" element={<PDFEditor />} />
          <Route path="/merge-pdf" element={<PDFMerger />} />
          <Route path="/split-pdf" element={<PDFSplitter />} />
          <Route path="/compress-pdf" element={<PDFCompressor />} />
          <Route path="/convert-pdf" element={<PDFConverter />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;