import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/hooks/useAuth";
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
import CraftDetectorPage from "./pages/CraftDetectorPage";
import ProfilePage from "./pages/ProfilePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<RequireAuth><DashboardHome /></RequireAuth>} />
            <Route path="/dashboard/upload" element={<RequireAuth><UploadProductPage /></RequireAuth>} />
            <Route path="/dashboard/story" element={<RequireAuth><StoryGeneratorPage /></RequireAuth>} />
            <Route path="/dashboard/social" element={<RequireAuth><SocialMediaPage /></RequireAuth>} />
            <Route path="/dashboard/markets" element={<RequireAuth><MarketDiscoveryPage /></RequireAuth>} />
            <Route path="/dashboard/products" element={<RequireAuth><MyProductsPage /></RequireAuth>} />
            <Route path="/dashboard/pricing" element={<RequireAuth><SmartPricingPage /></RequireAuth>} />
            <Route path="/dashboard/craft-detector" element={<RequireAuth><CraftDetectorPage /></RequireAuth>} />
            <Route path="/dashboard/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
