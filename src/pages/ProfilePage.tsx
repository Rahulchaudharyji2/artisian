import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, User, Edit2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Profile {
  name: string;
  location: string;
  craft_type: string;
  years_of_experience: number;
  story: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    location: "",
    craft_type: "",
    years_of_experience: 0,
    story: "",
  });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, location, craft_type, years_of_experience, story")
        .eq("id", user.id)
        .single();
      if (data) setProfile(data);
      if (error) console.error(error);
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile saved successfully!");
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Artisan Profile</h1>
              <p className="text-muted-foreground text-sm">
                {isEditing ? "Edit your profile" : "Your artisan information"}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl p-6 shadow-card border border-border space-y-6"
        >
          {!isEditing ? (
            // View Mode
            <>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</Label>
                  <p className="text-lg font-medium text-foreground">{profile.name || "—"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location</Label>
                  <p className="text-lg font-medium text-foreground">{profile.location || "—"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Craft Type</Label>
                  <p className="text-lg font-medium text-foreground">{profile.craft_type || "—"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Years of Experience</Label>
                  <p className="text-lg font-medium text-foreground">{profile.years_of_experience || 0}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Story</Label>
                <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.story || "—"}
                </p>
              </div>

              <Button
                onClick={() => setIsEditing(true)}
                variant="hero"
                size="lg"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, State, Country"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="craft_type">Craft Type</Label>
                  <Input
                    id="craft_type"
                    placeholder="e.g., Pottery, Weaving, Embroidery"
                    value={profile.craft_type}
                    onChange={(e) => setProfile({ ...profile, craft_type: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={profile.years_of_experience}
                    onChange={(e) => setProfile({ ...profile, years_of_experience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Your Story</Label>
                <Textarea
                  id="story"
                  placeholder="Share your journey as an artisan — how you started, what inspires you, what makes your craft special…"
                  value={profile.story}
                  onChange={(e) => setProfile({ ...profile, story: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSave}
                  variant="hero"
                  size="lg"
                  disabled={saving}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : "Save Profile"}
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
