import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import Messages from "./Messages";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import type { ConnectProfile } from "@/lib/types";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender?: string;
  bio: string;
  languages: string[];
  interests: string[];
  profilePhoto?: string;
  verified: 'unverified' | 'email' | 'id';
  isHost?: boolean;
  hostDetails?: {
    location: string;
    spaceType: string;
    maxGuests: number;
    houseRules: string;
    isPaid: boolean;
  };
  isLookingForBuddy?: boolean;
  buddyDetails?: {
    destinations: string[];
    startDate: string;
    endDate: string;
    companionAge: string;
    companionGender: string;
    activities: string[];
    travelStyle: string;
  };
}

const UserProfileManager = () => {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    age: 0,
    bio: '',
    languages: [],
    interests: [],
    verified: 'unverified',
    isHost: false,
    isLookingForBuddy: false,
  });

  const currentId = useMemo(() => profile.id, [profile.id]);

  useEffect(() => {
    // Prefer the connect profile stored by this app
    const saved = localStorage.getItem("currentConnectProfile");
    if (!saved) return;

    try {
      const p = JSON.parse(saved) as Partial<ConnectProfile> & { id?: string };
      if (!p.id) return;

      setProfile((prev) => ({
        ...prev,
        id: String(p.id ?? ""),
        name: String(p.name ?? prev.name),
        email: String(p.email ?? prev.email),
        age: Number(p.age ?? prev.age),
        gender: p.gender ?? prev.gender,
        bio: String(p.bio ?? prev.bio),
        languages: (p.languages as any) ?? prev.languages,
        interests: (p.interests as any) ?? prev.interests,
        verified: (p.verified as any) ?? prev.verified,
        profilePhoto: (p as any).profilePhoto ?? (p as any).profile_photo ?? prev.profilePhoto,
        isHost: Boolean((p as any).isHost ?? (p as any).is_host ?? prev.isHost),
        isLookingForBuddy: Boolean(
          (p as any).isLookingForBuddy ?? (p as any).is_looking_for_buddy ?? prev.isLookingForBuddy
        ),
        hostDetails: (p as any).hostDetails ?? (p as any).host_details ?? prev.hostDetails,
        buddyDetails: (p as any).buddyDetails ?? (p as any).buddy_details ?? prev.buddyDetails,
      }));
    } catch {
      // ignore
    }
  }, []);

  const [activeTab, setActiveTab] = useState('basic');

  const handleSave = async () => {
    if (!isSupabaseEnabled() || !supabase) {
      alert("Supabase is not configured.");
      return;
    }

    if (!profile.id) {
      alert("Missing profile id. Create profile first.");
      return;
    }

    // Persist to connect_profiles (company_id is locked by RLS/trigger)
    const payload: any = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      age: profile.age,
      gender: profile.gender ?? null,
      bio: profile.bio,
      profile_photo: profile.profilePhoto ?? null,
      email_verified: profile.verified === "email" || profile.verified === "id",
      verified: profile.verified,
      languages: profile.languages ?? [],
      interests: profile.interests ?? [],
      is_host: Boolean(profile.isHost),
      is_looking_for_buddy: Boolean(profile.isLookingForBuddy),
      host_details: profile.isHost ? profile.hostDetails ?? null : null,
      buddy_details: profile.isLookingForBuddy ? profile.buddyDetails ?? null : null,
      profile_visibility: "public",
      // travel_group_code/emergency fields are not in current UI; leave as-is on update
    };

    // Upsert by id
    const { error } = await supabase
      .from("connect_profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Profile save error:", error);
      alert("Failed to save profile.");
      return;
    }

    // Mirror in localStorage for other components to show immediately
    const updatedForLocal: any = {
      ...profile,
      emailVerified: payload.email_verified,
      profilePhoto: payload.profile_photo,
      isHost: payload.is_host,
      isLookingForBuddy: payload.is_looking_for_buddy,
      hostDetails: payload.host_details,
      buddyDetails: payload.buddy_details,
      profileVisibility: payload.profile_visibility,
      createdAt: (localStorage.getItem("currentConnectProfile") ? JSON.parse(localStorage.getItem("currentConnectProfile") as string).createdAt : undefined) ?? undefined,
    };

    localStorage.setItem("currentConnectProfile", JSON.stringify(updatedForLocal));
    localStorage.setItem("connectProfiles", JSON.stringify([updatedForLocal]));
    alert("Profile saved successfully!");
  };

  const handleVerification = (type: 'email' | 'id') => {
    // Mock verification - replace with actual verification flow
    setProfile(prev => ({ ...prev, verified: type }));
    alert(`${type === 'email' ? 'Email' : 'ID'} verification completed!`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.profilePhoto} />
              <AvatarFallback>{profile.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            My Profile
            <Badge variant={profile.verified === 'id' ? 'default' : 'secondary'}>
              <Shield className="h-3 w-3 mr-1" />
              {profile.verified === 'id' ? 'ID Verified' : profile.verified === 'email' ? 'Email Verified' : 'Unverified'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="hosting">Hosting</TabsTrigger>
              <TabsTrigger value="buddy">Travel Buddy</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    placeholder="Your age"
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender (Optional)</Label>
                  <Select value={profile.gender} onValueChange={(value) => setProfile(prev => ({ ...prev, gender: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell others about yourself..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Languages</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['English', 'Dzongkha', 'Hindi', 'Nepali', 'Tibetan'].map(lang => (
                    <label key={lang} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.languages.includes(lang)}
                        onCheckedChange={(checked) => {
                          const on = Boolean(checked);
                          setProfile(prev => ({
                            ...prev,
                            languages: on
                              ? [...prev.languages, lang]
                              : prev.languages.filter(l => l !== lang)
                          }));
                        }}
                      />
                      <span className="text-sm">{lang}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Trekking', 'Culture', 'Photography', 'Meditation', 'Nature', 'Food'].map(interest => (
                    <label key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        checked={profile.interests.includes(interest)}
                        onCheckedChange={(checked) => {
                          const on = Boolean(checked);
                          setProfile(prev => ({
                            ...prev,
                            interests: on
                              ? [...prev.interests, interest]
                              : prev.interests.filter(i => i !== interest)
                          }));
                        }}
                      />
                      <span className="text-sm">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleVerification('email')} variant="outline">
                  Verify Email
                </Button>
                <Button onClick={() => handleVerification('id')} variant="outline">
                  Verify ID
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="hosting" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isHost"
                  checked={Boolean(profile.isHost)}
                  onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isHost: Boolean(checked) }))}
                />
                <Label htmlFor="isHost">I can host travelers</Label>
              </div>

              {profile.isHost && (
                <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Location</Label>
                      <Select
                        value={profile.hostDetails?.location}
                        onValueChange={(value) => setProfile(prev => ({
                          ...prev,
                          hostDetails: { ...prev.hostDetails!, location: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paro">Paro</SelectItem>
                          <SelectItem value="Thimphu">Thimphu</SelectItem>
                          <SelectItem value="Punakha">Punakha</SelectItem>
                          <SelectItem value="Bumthang">Bumthang</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Space Type</Label>
                      <Select
                        value={profile.hostDetails?.spaceType}
                        onValueChange={(value) => setProfile(prev => ({
                          ...prev,
                          hostDetails: { ...prev.hostDetails!, spaceType: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select space" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Spare room">Spare room</SelectItem>
                          <SelectItem value="Couch">Couch</SelectItem>
                          <SelectItem value="Entire apartment">Entire apartment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Max Guests</Label>
                    <Input
                      type="number"
                      value={profile.hostDetails?.maxGuests || ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        hostDetails: { ...prev.hostDetails!, maxGuests: parseInt(e.target.value) }
                      }))}
                      placeholder="Maximum number of guests"
                    />
                  </div>

                  <div>
                    <Label>House Rules</Label>
                    <Textarea
                      value={profile.hostDetails?.houseRules}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        hostDetails: { ...prev.hostDetails!, houseRules: e.target.value }
                      }))}
                      placeholder="Any house rules or cultural considerations..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPaid"
                      checked={Boolean(profile.hostDetails?.isPaid)}
                      onCheckedChange={(checked) => setProfile(prev => ({
                        ...prev,
                        hostDetails: { ...prev.hostDetails!, isPaid: Boolean(checked) }
                      }))}
                    />
                    <Label htmlFor="isPaid">This is a paid homestay (licensed)</Label>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="buddy" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isLookingForBuddy"
                  checked={Boolean(profile.isLookingForBuddy)}
                  onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isLookingForBuddy: Boolean(checked) }))}
                />
                <Label htmlFor="isLookingForBuddy">I'm looking for a travel companion</Label>
              </div>

              {profile.isLookingForBuddy && (
                <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                  <div>
                    <Label>Destinations</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Paro', 'Thimphu', 'Punakha', 'Bumthang', 'Phobjikha', 'Haa'].map(dest => (
                        <label key={dest} className="flex items-center space-x-2">
                          <Checkbox
                            checked={profile.buddyDetails?.destinations.includes(dest)}
                            onCheckedChange={(checked) => {
                              const on = Boolean(checked);
                              setProfile(prev => ({
                                ...prev,
                                buddyDetails: {
                                  ...prev.buddyDetails!,
                                  destinations: on
                                    ? [...(prev.buddyDetails?.destinations || []), dest]
                                    : (prev.buddyDetails?.destinations || []).filter(d => d !== dest)
                                }
                              }));
                            }}
                          />
                          <span className="text-sm">{dest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={profile.buddyDetails?.startDate}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          buddyDetails: { ...prev.buddyDetails!, startDate: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={profile.buddyDetails?.endDate}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          buddyDetails: { ...prev.buddyDetails!, endDate: e.target.value }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Preferred Companion Age</Label>
                      <Select
                        value={profile.buddyDetails?.companionAge}
                        onValueChange={(value) => setProfile(prev => ({
                          ...prev,
                          buddyDetails: { ...prev.buddyDetails!, companionAge: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="18-25">18-25</SelectItem>
                          <SelectItem value="25-35">25-35</SelectItem>
                          <SelectItem value="35-45">35-45</SelectItem>
                          <SelectItem value="45+">45+</SelectItem>
                          <SelectItem value="Any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Preferred Gender</Label>
                      <Select
                        value={profile.buddyDetails?.companionGender}
                        onValueChange={(value) => setProfile(prev => ({
                          ...prev,
                          buddyDetails: { ...prev.buddyDetails!, companionGender: value }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Any">Any</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Preferred Activities</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['Trekking', 'Culture', 'Photography', 'Meditation', 'Nature', 'Food'].map(activity => (
                        <label key={activity} className="flex items-center space-x-2">
                          <Checkbox
                            checked={profile.buddyDetails?.activities.includes(activity)}
                            onCheckedChange={(checked) => {
                              const on = Boolean(checked);
                              setProfile(prev => ({
                                ...prev,
                                buddyDetails: {
                                  ...prev.buddyDetails!,
                                  activities: on
                                    ? [...(prev.buddyDetails?.activities || []), activity]
                                    : (prev.buddyDetails?.activities || []).filter(a => a !== activity)
                                }
                              }));
                            }}
                          />
                          <span className="text-sm">{activity}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Travel Style</Label>
                    <Textarea
                      value={profile.buddyDetails?.travelStyle}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        buddyDetails: { ...prev.buddyDetails!, travelStyle: e.target.value }
                      }))}
                      placeholder="Describe your travel style and what you're looking for in a companion..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="messages" className="mt-6">
              <Messages />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave}>Save Profile</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileManager;