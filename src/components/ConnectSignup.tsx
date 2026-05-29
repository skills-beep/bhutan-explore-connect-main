import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, CheckCircle, Mail, Shield, Sparkles, ArrowRight, Home, Backpack } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { emailVerificationService } from "@/lib/email-verification";
import type { ConnectProfile } from "@/lib/types";

const languages = ["English", "Dzongkha", "Mandarin", "French", "German", "Spanish", "Japanese"];
const interests = ["Culture", "Hiking", "Meditation", "Photography", "Food", "Art", "Music", "Nature", "Adventure", "History"];
const activities = ["Hiking", "Temple visits", "Local food tours", "Bird watching", "Photography", "Shopping", "Festivals", "Meditation", "Yoga"];
const destinations = ["Paro", "Thimphu", "Punakha", "Phobjikha", "Bumthang", "Haa", "Trongsa"];

const ConnectSignup = ({ onProfileCreated }: { onProfileCreated?: (profile: ConnectProfile) => void }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<ConnectProfile>>({
    languages: [],
    interests: [],
    isHost: false,
    isLookingForBuddy: false,
    profileVisibility: "public",
    verified: "unverified",
    emailVerified: false,
    age: 0,
  });
  const [emailCode, setEmailCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const totalSteps = 6;
  const progressPercentage = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleSaveProfile = async () => {
    // Check basic fields
    if (!profile.name || profile.name.trim() === "") {
      alert("❌ Name is required. Please enter your full name.");
      return;
    }
    if (!profile.email || profile.email.trim() === "") {
      alert("❌ Email is required. Please enter your email address.");
      return;
    }
    if (!profile.age || profile.age <= 0) {
      alert("❌ Age is required. Please enter your age as a number.");
      return;
    }
    if (!profile.bio || profile.bio.trim() === "") {
      alert("❌ Bio is required. Please tell us about yourself.");
      return;
    }
    
    // Allow saving without full verification so users can create a profile first.
    if (!profile.emailVerified) {
      alert("⚠️ Your profile will be saved as unverified. Complete email or ID verification later for full trust.");
    }

    const verifiedStatus = profile.idCardScan ? "id" : profile.emailVerified ? "email" : "unverified";

    const newProfile: ConnectProfile = {
      id: `user_${Date.now()}`,
      name: profile.name!,
      email: profile.email!,
      age: profile.age!,
      gender: profile.gender,
      bio: profile.bio!,
      profilePhoto: profile.profilePhoto,
      idCardScan: profile.idCardScan,
      facePhoto: profile.facePhoto,
      emailVerified: profile.emailVerified || false,
      travelGroupCode: profile.travelGroupCode,
      emergencyContactName: profile.emergencyContactName,
      emergencyContactPhone: profile.emergencyContactPhone,
      languages: profile.languages || [],
      interests: profile.interests || [],
      verified: verifiedStatus,
      isHost: profile.isHost || false,
      isLookingForBuddy: profile.isLookingForBuddy || false,
      hostDetails: profile.hostDetails,
      buddyDetails: profile.buddyDetails,
      createdAt: new Date().toISOString(),
      profileVisibility: profile.profileVisibility || "public",
    };

    // Save to Supabase first, then localStorage as fallback
    let savedToSupabase = false;
    if (isSupabaseEnabled()) {
      try {
        const { error } = await supabase!.from("connect_profiles").insert({
          id: newProfile.id,
          name: newProfile.name,
          email: newProfile.email,
          age: newProfile.age,
          gender: newProfile.gender,
          bio: newProfile.bio,
          profile_photo: newProfile.profilePhoto,
          id_card_scan: newProfile.idCardScan,
          face_photo: newProfile.facePhoto,
          email_verified: newProfile.emailVerified,
          travel_group_code: newProfile.travelGroupCode,
          emergency_contact_name: newProfile.emergencyContactName,
          emergency_contact_phone: newProfile.emergencyContactPhone,
          languages: newProfile.languages,
          interests: newProfile.interests,
          verified: newProfile.verified,
          is_host: newProfile.isHost,
          is_looking_for_buddy: newProfile.isLookingForBuddy,
          host_details: newProfile.hostDetails,
          buddy_details: newProfile.buddyDetails,
          created_at: newProfile.createdAt,
          profile_visibility: newProfile.profileVisibility,
        });

        if (error) {
          console.error("❌ Supabase Error:", error);
          console.error("Error code:", error.code);
          console.error("Error message:", error.message);
          
          // Check if it's a table not found error
          if (error.code === "PGRST116" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
            alert(`❌ Supabase tables not created yet!\n\nPlease run the SQL setup:\n\n1. Go to your Supabase Dashboard\n2. Click "SQL Editor"\n3. Copy and run the SQL from:\n   supabase-setup.sql\n\nThen try saving your profile again.`);
          } else if (error.code === "42501" || error.message?.includes("permission")) {
            alert(`❌ Permission error in Supabase.\n\nMake sure Row Level Security (RLS) policies allow inserts.\n\nError: ${error.message}`);
          } else {
            alert(`❌ Could not save to Supabase: ${error.message}\n\nCheck the browser console for details.`);
          }
          return;
        } else {
          savedToSupabase = true;
          console.log("✅ Profile saved to Supabase!");
        }
      } catch (err) {
        console.error("❌ Unexpected error saving to Supabase:", err);
        alert(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
        return;
      }
    } else {
      console.warn("⚠️ Supabase not configured. Saving locally only.");
    }

    // Save to localStorage as backup
    const existingProfiles = JSON.parse(localStorage.getItem("connectProfiles") || "[]");
    existingProfiles.push(newProfile);
    localStorage.setItem("connectProfiles", JSON.stringify(existingProfiles));
    localStorage.setItem("currentConnectProfile", JSON.stringify(newProfile));

    onProfileCreated?.(newProfile);
    alert(savedToSupabase 
      ? "✅ Profile created successfully and saved online in Supabase!" 
      : "⚠️ Profile saved locally. Supabase was not available.");
    setStep(1);
  };

  return (
    <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <h1 className="text-4xl font-bold">Join Bhutan Connects</h1>
            <Sparkles className="h-6 w-6 text-amber-500" />
          </div>
          <p className="text-muted-foreground text-lg">Create your profile to connect with hosts and travel buddies</p>
        </motion.div>

        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Step {step} of {totalSteps}</CardTitle>
                <Badge variant="outline">
                  <Shield className="h-3 w-3 mr-1" />
                  {profile.verified === "id" ? "ID Verified" : profile.verified === "email" ? "Email Verified" : "Unverified"}
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardHeader>

          <CardContent className="pt-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Let's Start with the Basics
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your name"
                        value={profile.name || ""}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="font-medium">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={profile.email || ""}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="font-medium">Age *</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          value={profile.age || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            setProfile({ ...profile, age: val === "" ? 0 : parseInt(val) });
                          }}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender" className="font-medium">Gender</Label>
                        <Select value={profile.gender || ""} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="font-medium">Tell us about yourself *</Label>
                      <Textarea
                        id="bio"
                        placeholder="Share a bit about yourself, your interests, and what you're looking for in Bhutan..."
                        value={profile.bio || ""}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="mt-2 min-h-24"
                      />
                      <p className="text-xs text-muted-foreground mt-1">{(profile.bio || "").length}/200</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Security, ID & Group */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">Security, ID & Group</h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="font-medium">Email Verification</Label>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={profile.email || ""}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        />
                        <Button
                          onClick={async () => {
                            if (!profile.email) {
                              alert("Enter your email before sending a verification code.");
                              return;
                            }
                            const result = await emailVerificationService.sendVerificationCode(
                              profile.email,
                              profile.name || "User"
                            );
                            if (result.success) {
                              setIsEmailSent(true);
                              toast({ title: "Success", description: "Verification code sent to your email!" });
                            } else {
                              alert(`❌ ${result.error}`);
                            }
                          }}
                        >
                          Send Code
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                        <Input
                          placeholder="Enter verification code"
                          value={emailCode}
                          onChange={(e) => setEmailCode(e.target.value)}
                        />
                        <Button
                          disabled={!isEmailSent}
                          onClick={async () => {
                            if (!profile.email) {
                              alert("Email is required");
                              return;
                            }
                            const result = await emailVerificationService.verifyCode(
                              profile.email,
                              emailCode
                            );
                            if (result.success) {
                              setProfile({ ...profile, emailVerified: true });
                              setEmailCode("");
                              toast({ title: "Success", description: "Email verified successfully!" });
                            } else {
                              alert(`❌ ${result.error}`);
                            }
                          }}
                        >
                          Verify Email
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {profile.emailVerified ? "Email verified" : "Email is not verified yet."}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Upload Government ID (optional)</Label>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setProfile({ ...profile, idCardScan: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="block w-full rounded-lg border border-border p-2"
                      />
                      <p className="text-xs text-muted-foreground">Uploading your ID will help verify your profile, but it is not required to save.</p>
                      {profile.idCardScan && (
                        <div className="rounded-xl border border-border overflow-hidden bg-background">
                          <img src={profile.idCardScan} alt="Uploaded ID" className="w-full object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="font-medium">Face Capture (optional)</Label>
                      <p className="text-xs text-muted-foreground">Capture a selfie to improve verification trust, but this step is optional.</p>
                      <div className="space-y-3">
                        {profile.facePhoto && (
                          <div className="rounded-xl border border-border overflow-hidden bg-background">
                            <img src={profile.facePhoto} alt="Face capture" className="w-full object-cover" />
                          </div>
                        )}
                        {isCapturing ? (
                          <div className="space-y-3">
                            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl border border-border" />
                            <div className="flex gap-3">
                              <Button onClick={() => {
                                if (!videoRef.current || !canvasRef.current) return;
                                const video = videoRef.current;
                                const canvas = canvasRef.current;
                                canvas.width = video.videoWidth;
                                canvas.height = video.videoHeight;
                                const ctx = canvas.getContext("2d");
                                if (!ctx) return;
                                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                                const dataUrl = canvas.toDataURL("image/jpeg");
                                // Use captured face as both facePhoto and profilePhoto
                                setProfile({ ...profile, facePhoto: dataUrl, profilePhoto: dataUrl });
                                if (stream) {
                                  stream.getTracks().forEach((track) => track.stop());
                                  setStream(null);
                                }
                                setIsCapturing(false);
                              }}>
                                Capture Face
                              </Button>
                              <Button variant="outline" onClick={() => {
                                if (stream) {
                                  stream.getTracks().forEach((track) => track.stop());
                                  setStream(null);
                                }
                                setIsCapturing(false);
                              }}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button onClick={async () => {
                            if (!navigator.mediaDevices?.getUserMedia) {
                              alert("Webcam access is not available in this browser.");
                              return;
                            }
                            try {
                              const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                              if (videoRef.current) {
                                videoRef.current.srcObject = mediaStream;
                              }
                              setStream(mediaStream);
                              setIsCapturing(true);
                            } catch (error) {
                              alert("Unable to access webcam. Please allow camera permission.");
                            }
                          }}>
                            Start Face Capture
                          </Button>
                        )}
                        <canvas ref={canvasRef} className="hidden" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="travelGroupCode" className="font-medium">Travel Group Code</Label>
                        <Input
                          id="travelGroupCode"
                          placeholder="Optional group code"
                          value={profile.travelGroupCode || ""}
                          onChange={(e) => setProfile({ ...profile, travelGroupCode: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="emergencyContactName" className="font-medium">Emergency Contact</Label>
                        <Input
                          id="emergencyContactName"
                          placeholder="Name"
                          value={profile.emergencyContactName || ""}
                          onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactPhone" className="font-medium">Emergency Phone</Label>
                      <Input
                        id="emergencyContactPhone"
                        placeholder="Phone number"
                        value={profile.emergencyContactPhone || ""}
                        onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Languages & Interests */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold">Languages & Interests</h3>

                  <div>
                    <Label className="font-medium mb-3 block">Languages You Speak</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {languages.map((lang) => (
                        <div key={lang} className="flex items-center space-x-2">
                          <Checkbox
                            id={`lang-${lang}`}
                            checked={(profile.languages || []).includes(lang)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setProfile({ ...profile, languages: [...(profile.languages || []), lang] });
                              } else {
                                setProfile({
                                  ...profile,
                                  languages: (profile.languages || []).filter((l) => l !== lang),
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`lang-${lang}`} className="cursor-pointer font-normal">{lang}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-medium mb-3 block">Your Interests</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {interests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={`interest-${interest}`}
                            checked={(profile.interests || []).includes(interest)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setProfile({ ...profile, interests: [...(profile.interests || []), interest] });
                              } else {
                                setProfile({
                                  ...profile,
                                  interests: (profile.interests || []).filter((i) => i !== interest),
                                });
                              }
                            }}
                          />
                          <Label htmlFor={`interest-${interest}`} className="cursor-pointer font-normal">{interest}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Hosting Preferences */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Hosting Preferences
                  </h3>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <Checkbox
                      id="isHost"
                      checked={profile.isHost || false}
                      onCheckedChange={(checked) => {
                        setProfile({ ...profile, isHost: checked as boolean });
                        if (!checked) {
                          setProfile({ ...profile, hostDetails: undefined });
                        }
                      }}
                    />
                    <Label htmlFor="isHost" className="cursor-pointer font-medium flex-1">
                      I can host travelers in my home
                    </Label>
                  </div>

                  {profile.isHost && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 p-4 rounded-lg bg-secondary/10 border border-secondary"
                    >
                      <div>
                        <Label htmlFor="location" className="font-medium">My Location *</Label>
                        <Select
                          value={profile.hostDetails?.location || ""}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              hostDetails: { ...profile.hostDetails!, location: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {destinations.map((dest) => (
                              <SelectItem key={dest} value={dest}>{dest}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="spaceType" className="font-medium">Type of Space *</Label>
                        <Select
                          value={profile.hostDetails?.spaceType || ""}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              hostDetails: { ...profile.hostDetails!, spaceType: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select space type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Private room">Private room</SelectItem>
                            <SelectItem value="Shared room">Shared room</SelectItem>
                            <SelectItem value="Entire apartment">Entire apartment</SelectItem>
                            <SelectItem value="Guesthouse">Guesthouse</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="maxGuests" className="font-medium">Max Guests *</Label>
                        <Input
                          id="maxGuests"
                          type="number"
                          placeholder="2"
                          value={profile.hostDetails?.maxGuests || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              hostDetails: { ...profile.hostDetails!, maxGuests: parseInt(e.target.value) },
                            })
                          }
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="houseRules" className="font-medium">House Rules</Label>
                        <Textarea
                          id="houseRules"
                          placeholder="Share any house rules or guidelines..."
                          value={profile.hostDetails?.houseRules || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              hostDetails: { ...profile.hostDetails!, houseRules: e.target.value },
                            })
                          }
                          className="mt-2 min-h-20"
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 5: Travel Buddy */}
              {step === 5 && (
                <motion.div
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Backpack className="h-5 w-5" />
                    Travel Buddy Search
                  </h3>

                  <div className="flex items-center space-x-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                    <Checkbox
                      id="isLookingForBuddy"
                      checked={profile.isLookingForBuddy || false}
                      onCheckedChange={(checked) => {
                        setProfile({ ...profile, isLookingForBuddy: checked as boolean });
                        if (!checked) {
                          setProfile({ ...profile, buddyDetails: undefined });
                        }
                      }}
                    />
                    <Label htmlFor="isLookingForBuddy" className="cursor-pointer font-medium flex-1">
                      I'm looking for a travel companion
                    </Label>
                  </div>

                  {profile.isLookingForBuddy && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4 p-4 rounded-lg bg-secondary/10 border border-secondary"
                    >
                      <div>
                        <Label className="font-medium mb-3 block">Destinations *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {destinations.map((dest) => (
                            <div key={dest} className="flex items-center space-x-2">
                              <Checkbox
                                id={`dest-${dest}`}
                                checked={(profile.buddyDetails?.destinations || []).includes(dest)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setProfile({
                                      ...profile,
                                      buddyDetails: {
                                        ...profile.buddyDetails!,
                                        destinations: [...(profile.buddyDetails?.destinations || []), dest],
                                      },
                                    });
                                  } else {
                                    setProfile({
                                      ...profile,
                                      buddyDetails: {
                                        ...profile.buddyDetails!,
                                        destinations: (profile.buddyDetails?.destinations || []).filter((d) => d !== dest),
                                      },
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={`dest-${dest}`} className="cursor-pointer font-normal">{dest}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="font-medium">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={profile.buddyDetails?.startDate || ""}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                buddyDetails: { ...profile.buddyDetails!, startDate: e.target.value },
                              })
                            }
                            className="mt-2"
                          />
                        </div>

                        <div>
                          <Label htmlFor="endDate" className="font-medium">End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={profile.buddyDetails?.endDate || ""}
                            onChange={(e) =>
                              setProfile({
                                ...profile,
                                buddyDetails: { ...profile.buddyDetails!, endDate: e.target.value },
                              })
                            }
                            className="mt-2"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="font-medium mb-3 block">Companion Age Range *</Label>
                        <Input
                          placeholder="e.g., 20-35"
                          value={profile.buddyDetails?.companionAge || ""}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              buddyDetails: { ...profile.buddyDetails!, companionAge: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="companionGender" className="font-medium">Companion Gender *</Label>
                        <Select
                          value={profile.buddyDetails?.companionGender || ""}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              buddyDetails: { ...profile.buddyDetails!, companionGender: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Any">Any</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="font-medium mb-3 block">Activities</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {activities.map((activity) => (
                            <div key={activity} className="flex items-center space-x-2">
                              <Checkbox
                                id={`activity-${activity}`}
                                checked={(profile.buddyDetails?.activities || []).includes(activity)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setProfile({
                                      ...profile,
                                      buddyDetails: {
                                        ...profile.buddyDetails!,
                                        activities: [...(profile.buddyDetails?.activities || []), activity],
                                      },
                                    });
                                  } else {
                                    setProfile({
                                      ...profile,
                                      buddyDetails: {
                                        ...profile.buddyDetails!,
                                        activities: (profile.buddyDetails?.activities || []).filter((a) => a !== activity),
                                      },
                                    });
                                  }
                                }}
                              />
                              <Label htmlFor={`activity-${activity}`} className="cursor-pointer font-normal">{activity}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="travelStyle" className="font-medium">Travel Style *</Label>
                        <Select
                          value={profile.buddyDetails?.travelStyle || ""}
                          onValueChange={(value) =>
                            setProfile({
                              ...profile,
                              buddyDetails: { ...profile.buddyDetails!, travelStyle: value },
                            })
                          }
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Budget">Budget</SelectItem>
                            <SelectItem value="Mid-range">Mid-range</SelectItem>
                            <SelectItem value="Luxury">Luxury</SelectItem>
                            <SelectItem value="Adventure">Adventure</SelectItem>
                            <SelectItem value="Cultural">Cultural</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 6: Review & Publish */}
              {step === 6 && (
                <motion.div
                  key="step6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Review Your Profile
                  </h3>

                  <div className="space-y-4">
                    <Card className="bg-secondary/5">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium">Name:</span>
                            <span>{profile.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Email:</span>
                            <span className="text-sm">{profile.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Age:</span>
                            <span>{profile.age} {profile.gender && `(${profile.gender})`}</span>
                          </div>
                          <div>
                            <span className="font-medium">Bio:</span>
                            <p className="text-sm mt-1">{profile.bio}</p>
                          </div>
                          <div>
                            <span className="font-medium">Languages:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(profile.languages || []).map((lang) => (
                                <Badge key={lang} variant="outline">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Interests:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(profile.interests || []).map((interest) => (
                                <Badge key={interest} variant="outline">{interest}</Badge>
                              ))}
                            </div>
                          </div>

                          <div className="border-t pt-3">
                            <span className="font-medium">Verification</span>
                            <div className="text-sm text-muted-foreground mt-1">
                              {profile.emailVerified ? "Email verified" : "Email not verified yet"}
                              <br />
                              {profile.idCardScan ? "ID uploaded" : "ID upload missing"}
                              <br />
                              {profile.facePhoto ? "Face captured" : "Face capture missing"}
                            </div>
                          </div>

                          {(profile.travelGroupCode || profile.emergencyContactName || profile.emergencyContactPhone) && (
                            <div className="border-t pt-3">
                              <span className="font-medium">Safety & Group Info</span>
                              <div className="text-sm text-muted-foreground mt-1">
                                {profile.travelGroupCode && <div>Group Code: {profile.travelGroupCode}</div>}
                                {profile.emergencyContactName && <div>Emergency Contact: {profile.emergencyContactName}</div>}
                                {profile.emergencyContactPhone && <div>Emergency Phone: {profile.emergencyContactPhone}</div>}
                              </div>
                            </div>
                          )}

                          {profile.isHost && (
                            <div className="border-t pt-3">
                              <span className="font-medium block mb-2 flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Hosting Info
                              </span>
                              <div className="text-sm space-y-1 ml-6">
                                <div>Location: {profile.hostDetails?.location}</div>
                                <div>Space: {profile.hostDetails?.spaceType}</div>
                                <div>Max guests: {profile.hostDetails?.maxGuests}</div>
                              </div>
                            </div>
                          )}

                          {profile.isLookingForBuddy && (
                            <div className="border-t pt-3">
                              <span className="font-medium block mb-2 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Travel Buddy Info
                              </span>
                              <div className="text-sm space-y-1 ml-6">
                                <div>Destinations: {profile.buddyDetails?.destinations?.join(", ")}</div>
                                <div>Dates: {profile.buddyDetails?.startDate} to {profile.buddyDetails?.endDate}</div>
                                <div>Activities: {profile.buddyDetails?.activities?.join(", ")}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex items-center space-x-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
                      <Checkbox
                        id="visibility"
                        checked={profile.profileVisibility === "public"}
                        onCheckedChange={(checked) =>
                          setProfile({
                            ...profile,
                            profileVisibility: checked ? "public" : "private",
                          })
                        }
                      />
                      <Label htmlFor="visibility" className="cursor-pointer font-medium flex-1">
                        Make my profile public so others can find me
                      </Label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={step === 1}
                className="flex-1"
              >
                Previous
              </Button>

              {step === totalSteps ? (
                <Button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Profile & Join
                </Button>
              ) : (
                <Button onClick={handleNext} className="flex-1">
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConnectSignup;
