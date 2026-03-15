import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, ArrowLeft, Save, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { getProfileCompletion } from "@/lib/profileCompletion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [firstName, setFirstName] = useState(profile?.first_name || "");
  const [lastName, setLastName] = useState(profile?.last_name || "");
  const [gender, setGender] = useState(profile?.gender || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [currentLocation, setCurrentLocation] = useState(profile?.current_location || "");
  const [guardianName, setGuardianName] = useState(profile?.guardian_name || "");
  const [guardianRelation, setGuardianRelation] = useState(profile?.guardian_relation || "");
  const [guardianMobile, setGuardianMobile] = useState(profile?.guardian_mobile || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completion = getProfileCompletion({
    first_name: firstName,
    last_name: lastName,
    gender,
    phone,
    current_location: currentLocation,
    avatar_url: profile?.avatar_url,
    guardian_name: guardianName,
    guardian_relation: guardianRelation,
    guardian_mobile: guardianMobile,
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2MB");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/passport.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Failed to upload photo");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: urlData.publicUrl })
      .eq("user_id", user!.id);

    setUploading(false);
    if (updateError) {
      toast.error("Failed to save photo URL");
    } else {
      toast.success("Photo uploaded!");
      await refreshProfile();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
        gender,
        phone,
        current_location: currentLocation,
        guardian_name: guardianName,
        guardian_relation: guardianRelation,
        guardian_mobile: guardianMobile,
      })
      .eq("user_id", user!.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to update profile");
    } else {
      toast.success("Profile updated!");
      await refreshProfile();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container max-w-2xl py-8 space-y-6">
        {/* Profile Completion Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Profile Completion</p>
                <span className={`text-sm font-bold ${completion >= 80 ? "text-emerald-600" : "text-amber-600"}`}>
                  {completion}%
                </span>
              </div>
              <Progress value={completion} className="h-3" />
              {completion < 80 && (
                <p className="mt-2 text-xs text-destructive">
                  You need at least 80% profile completion to enroll in programs. Please fill in the required fields below.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                {/* Student ID & Email (read-only) */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Student ID</p>
                    <p className="font-mono text-sm font-bold text-foreground">{profile?.student_id || "Generating..."}</p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">Student Email</p>
                    <p className="text-sm font-medium text-foreground truncate">{user?.email || ""}</p>
                  </div>
                </div>

                {/* Passport Photo */}
                <div className="space-y-2">
                  <Label>Passport Photo *</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={profile?.avatar_url || ""} alt="Passport" />
                      <AvatarFallback className="bg-muted">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                      >
                        <Upload className="h-4 w-4" />
                        {uploading ? "Uploading..." : "Upload Photo"}
                      </Button>
                      <p className="mt-1 text-xs text-muted-foreground">Passport size, max 2MB</p>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Personal Details</h3>
                  <div className="h-px bg-border" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter first name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter last name" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Student Mobile No *</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+254 7XX XXX XXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Current Location *</Label>
                  <Input id="location" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} placeholder="City, Country" />
                </div>

                {/* Guardian Details */}
                <div className="space-y-1 pt-2">
                  <h3 className="text-sm font-semibold text-foreground">Guardian Details</h3>
                  <div className="h-px bg-border" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input id="guardianName" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardianRelation">Relation *</Label>
                    <Select value={guardianRelation} onValueChange={setGuardianRelation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="uncle_aunt">Uncle/Aunt</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianMobile">Guardian Mobile No *</Label>
                  <Input id="guardianMobile" value={guardianMobile} onChange={(e) => setGuardianMobile(e.target.value)} placeholder="+254 7XX XXX XXX" />
                </div>

                <Button type="submit" variant="hero" className="gap-2 w-full sm:w-auto" disabled={saving}>
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
