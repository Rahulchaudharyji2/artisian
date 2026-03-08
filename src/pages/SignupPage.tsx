import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import kalaLogo from "@/assets/kala-logo.png";

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to auth when Cloud is enabled
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-indigo items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <img src={kalaLogo} alt="KALA AI" className="h-20 w-20 mx-auto mb-8" />
          <h2 className="text-3xl font-display font-bold text-secondary-foreground mb-4">
            Welcome to KALA AI
          </h2>
          <p className="text-secondary-foreground/80 max-w-sm mx-auto">
            Your AI-powered digital manager for crafts. Create listings, build your brand, reach the world.
          </p>
        </motion.div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="lg:hidden flex items-center gap-2 mb-4">
            <img src={kalaLogo} alt="KALA AI" className="h-10 w-10" />
            <span className="font-display text-xl font-bold text-foreground">KALA AI</span>
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Create your account</h1>
            <p className="text-muted-foreground mt-1">Start your artisan journey today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg">
              Create Account
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
