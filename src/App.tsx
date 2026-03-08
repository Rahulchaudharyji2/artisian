import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardHome from "./pages/DashboardHome";
import UploadProductPage from "./pages/UploadProductPage";
import StoryGeneratorPage from "./pages/StoryGeneratorPage";
import SocialMediaPage from "./pages/SocialMediaPage";
import MarketDiscoveryPage from "./pages/MarketDiscoveryPage";
import MyProductsPage from "./pages/MyProductsPage";
import SmartPricingPage from "./pages/SmartPricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/upload" element={<UploadProductPage />} />
          <Route path="/dashboard/story" element={<StoryGeneratorPage />} />
          <Route path="/dashboard/social" element={<SocialMediaPage />} />
          <Route path="/dashboard/markets" element={<MarketDiscoveryPage />} />
          <Route path="/dashboard/products" element={<MyProductsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
