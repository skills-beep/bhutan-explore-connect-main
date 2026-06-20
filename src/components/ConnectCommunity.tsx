import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, MapPin, Globe, Heart, Users, MessageCircle, Send, Star, Check, X, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import type { ConnectProfile } from "@/lib/types";

const ConnectCommunity = () => {
  const [profiles, setProfiles] = useState<ConnectProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ConnectProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<ConnectProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "hosts" | "buddies">("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [favoriteUsers, setFavoriteUsers] = useState<string[]>([]);
  const [connectionRequests, setConnectionRequests] = useState<{ from: string; to: string; message: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeConnectProfile = (p: any): ConnectProfile => ({
    id: String(p?.id ?? ""),
    name: String(p?.name ?? ""),
    email: String(p?.email ?? ""),
    age: Number(p?.age ?? 18),
    gender: p?.gender ? String(p.gender) : undefined,
    bio: String(p?.bio ?? ""),
    profilePhoto: p?.profilePhoto ?? p?.profile_photo,
    emailVerified: Boolean(p?.emailVerified ?? p?.email_verified ?? false),
    travelGroupCode: p?.travelGroupCode ?? p?.travel_group_code,
    emergencyContactName: p?.emergencyContactName ?? p?.emergency_contact_name,
    emergencyContactPhone: p?.emergencyContactPhone ?? p?.emergency_contact_phone,
    languages: Array.isArray(p?.languages) ? p.languages : p?.languages ?? [],
    interests: Array.isArray(p?.interests) ? p.interests : p?.interests ?? [],
    verified: (p?.verified ?? "unverified") as any,
    isHost: Boolean(p?.isHost ?? p?.is_host ?? false),
    isLookingForBuddy: Boolean(p?.isLookingForBuddy ?? p?.is_looking_for_buddy ?? false),
    hostDetails: p?.hostDetails ?? p?.host_details,
    buddyDetails: p?.buddyDetails ?? p?.buddy_details,
    createdAt: p?.createdAt ?? p?.created_at ?? new Date().toISOString(),
    profileVisibility: (p?.profileVisibility ?? p?.profile_visibility ?? "public") as any,
  });


  // Map database row to ConnectProfile
  const mapProfileRow = (row: any): ConnectProfile => ({
    id: String(row?.id ?? ""),
    name: String(row?.name ?? ""),
    email: String(row?.email ?? ""),
    age: Number(row?.age ?? 18),
    gender: row?.gender ? String(row.gender) : undefined,
    bio: String(row?.bio ?? ""),
    profilePhoto: row?.profile_photo ?? row?.profilePhoto,
    emailVerified: Boolean(row?.email_verified ?? row?.emailVerified ?? false),
    travelGroupCode: row?.travel_group_code ?? row?.travelGroupCode,
    emergencyContactName: row?.emergency_contact_name ?? row?.emergencyContactName,
    emergencyContactPhone: row?.emergency_contact_phone ?? row?.emergencyContactPhone,
    languages: Array.isArray(row?.languages) ? row.languages : [],
    interests: Array.isArray(row?.interests) ? row.interests : [],
    verified: (row?.verified ?? "unverified") as any,
    isHost: Boolean(row?.is_host ?? row?.isHost ?? false),
    isLookingForBuddy: Boolean(row?.is_looking_for_buddy ?? row?.isLookingForBuddy ?? false),
    hostDetails: row?.host_details,
    buddyDetails: row?.buddy_details,
    createdAt: row?.created_at ?? row?.createdAt ?? new Date().toISOString(),
    profileVisibility: (row?.profile_visibility ?? row?.profileVisibility ?? "public") as any,
  });


  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);

      // Load current user profile from localStorage
      const saved = localStorage.getItem("currentConnectProfile");
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrentProfile({
          ...parsed,
          emailVerified: Boolean(parsed.emailVerified ?? parsed.email_verified ?? false),
          isHost: Boolean(parsed.isHost ?? false),
          isLookingForBuddy: Boolean(parsed.isLookingForBuddy ?? false),
          languages: Array.isArray(parsed.languages) ? parsed.languages : [],
          interests: Array.isArray(parsed.interests) ? parsed.interests : [],
          verified: (parsed.verified ?? parsed.verified_status ?? "unverified") as any,
          profileVisibility: (parsed.profileVisibility ?? "public") as any,
          createdAt: parsed.createdAt ?? parsed.created_at ?? new Date().toISOString(),
          profilePhoto: parsed.profilePhoto ?? parsed.profile_photo,
          idCardScan: parsed.idCardScan ?? parsed.id_card_scan,
          facePhoto: parsed.facePhoto ?? parsed.face_photo,
          travelGroupCode: parsed.travelGroupCode ?? parsed.travel_group_code,
          emergencyContactName:
            parsed.emergencyContactName ?? parsed.emergency_contact_name,
          emergencyContactPhone:
            parsed.emergencyContactPhone ?? parsed.emergency_contact_phone,
          hostDetails: parsed.hostDetails ?? parsed.host_details,
          buddyDetails: parsed.buddyDetails ?? parsed.buddy_details,
        });
      }

      // Load profiles from Supabase if enabled
      if (isSupabaseEnabled()) {
        const { data, error } = await supabase!
          .from("connect_profiles")
          .select("*")
          .eq("profile_visibility", "public")
          .eq("verified", "id")
          .eq("email_verified", true)
          .order("created_at", { ascending: false });


        if (error) {
          console.error("Error loading profiles:", error);
          toast({ title: "Error", description: "Failed to load profiles", variant: "destructive" });
          // Fallback to localStorage
          const savedProfiles = JSON.parse(localStorage.getItem("connectProfiles") || "[]");
          setProfiles(savedProfiles);
        } else {
          const mappedProfiles = (data ?? []).map(mapProfileRow);
          setProfiles(mappedProfiles);
          // Update localStorage as backup
          localStorage.setItem("connectProfiles", JSON.stringify(mappedProfiles));
        }
      } else {
        // Fallback to localStorage if Supabase not enabled
        const savedProfiles = JSON.parse(localStorage.getItem("connectProfiles") || "[]");
        setProfiles(savedProfiles);
      }

      setIsLoading(false);
    };

    loadProfiles();

    // Load favorites from localStorage
    const saved = localStorage.getItem("favoriteUsers");
    if (saved) setFavoriteUsers(JSON.parse(saved));

    // Set up real-time subscription
    let channel: any;
    if (isSupabaseEnabled()) {
      channel = supabase!.channel("public:connect_profiles")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "connect_profiles" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const newProfile = mapProfileRow(payload.new);
              if (newProfile.profileVisibility === "public") {
                setProfiles((prev) => [newProfile, ...prev]);
              }
            } else if (payload.eventType === "UPDATE") {
              const updatedProfile = mapProfileRow(payload.new);
              setProfiles((prev) =>
                prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
              );
            } else if (payload.eventType === "DELETE") {
              setProfiles((prev) => prev.filter((p) => p.id !== payload.old.id));
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel && isSupabaseEnabled()) {
        void supabase!.removeChannel(channel);
      }
    };
  }, []);

  // Re-filter whenever profiles, searchTerm, filterType, or selectedLocation changes
  useEffect(() => {
    filterProfiles(profiles, searchTerm, filterType, selectedLocation);
  }, [profiles, searchTerm, filterType, selectedLocation]);

  const filterProfiles = (list: ConnectProfile[], search: string, type: string, location: string) => {
    let filtered = list
      .filter((p) => p.profileVisibility === "public")
      .filter((p) => p.verified === "id")
      .filter((p) => p.emailVerified === true);


    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter((p) => {
        const name = (p.name ?? "").toLowerCase();
        const bio = (p.bio ?? "").toLowerCase();
        return name.includes(q) || bio.includes(q);
      });
    }


    if (type === "hosts") {
      filtered = filtered.filter((p) => p.isHost);
    } else if (type === "buddies") {
      filtered = filtered.filter((p) => p.isLookingForBuddy);
    }

    if (location !== "all") {
      filtered = filtered.filter((p) => p.hostDetails?.location === location || p.buddyDetails?.destinations.includes(location));
    }

    setFilteredProfiles(filtered);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterProfiles(profiles, term, filterType, selectedLocation);
  };

  const handleFilterType = (type: "all" | "hosts" | "buddies") => {
    setFilterType(type);
    filterProfiles(profiles, searchTerm, type, selectedLocation);
  };

  const handleLocationFilter = (location: string) => {
    setSelectedLocation(location);
    filterProfiles(profiles, searchTerm, filterType, location);
  };

  const toggleFavorite = (userId: string) => {
    const updated = favoriteUsers.includes(userId)
      ? favoriteUsers.filter((id) => id !== userId)
      : [...favoriteUsers, userId];
    setFavoriteUsers(updated);
    localStorage.setItem("favoriteUsers", JSON.stringify(updated));
  };

  const sendConnectionRequest = async (toUserId: string, message: string) => {
    if (!currentProfile) {
      alert("Please create your profile first!");
      return;
    }

    if (!message.trim()) {
      alert("Please write a message before sending");
      return;
    }

    const newRequest = {
      from: currentProfile.id,
      to: toUserId,
      message,
      createdAt: new Date().toISOString(),
    };

    if (isSupabaseEnabled()) {
      const { error } = await supabase!.from("connection_requests").insert({
        from_user_id: newRequest.from,
        to_user_id: newRequest.to,
        message: newRequest.message,
        created_at: newRequest.createdAt,
      });

      if (error) {
        console.error("Error sending connection request:", error);
        toast({
          title: "Error",
          description: "Failed to send connection request (Supabase)",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "Success", description: "Connection request sent (Supabase)!" });
      return;
    }

    // Supabase disabled: keep localStorage backup only
    const existing = JSON.parse(localStorage.getItem("connectionRequests") || "[]");
    existing.push(newRequest);
    localStorage.setItem("connectionRequests", JSON.stringify(existing));
    toast({ title: "Saved locally", description: "Supabase not enabled; stored in localStorage." });
  };

  const getLocations = () => {
    const locations = new Set<string>();
    profiles.forEach((p) => {
      if (p.hostDetails?.location) locations.add(p.hostDetails.location);
      if (p.buddyDetails?.destinations) p.buddyDetails.destinations.forEach((d) => locations.add(d));
    });
    return Array.from(locations);
  };

  const ProfileCard = ({ profile }: { profile: ConnectProfile }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-300 bg-gradient-to-br from-background to-secondary/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.profilePhoto} />
            <AvatarFallback className="text-lg font-semibold">
              {profile.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-black dark:text-white">{profile.name}, {profile.age}</h3>
              <Badge variant={profile.verified === "id" ? "default" : "secondary"} className="text-xs">
                {profile.verified === "id" ? "✓ ID" : profile.verified === "email" ? "✓ Email" : "Unverified"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{profile.bio}</p>
          </div>
        </div>
        <button
          onClick={() => toggleFavorite(profile.id)}
          className="text-2xl transition-colors"
        >
          {favoriteUsers.includes(profile.id) ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-1">
          {profile.languages.slice(0, 2).map((lang) => (
            <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
          ))}
          {profile.languages.length > 2 && (
            <Badge variant="outline" className="text-xs">+{profile.languages.length - 2}</Badge>
          )}
        </div>

        {profile.isHost && (
          <div className="text-sm bg-primary/10 p-2 rounded flex items-start gap-2">
            <Heart className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Hosting in {profile.hostDetails?.location}</div>
              <div className="text-xs text-muted-foreground">{profile.hostDetails?.spaceType} • Max {profile.hostDetails?.maxGuests} guests</div>
            </div>
          </div>
        )}

        {profile.isLookingForBuddy && (
          <div className="text-sm bg-secondary/10 p-2 rounded flex items-start gap-2">
            <Users className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium">Seeking travel buddy</div>
              <div className="text-xs text-muted-foreground">
                {profile.buddyDetails?.startDate} • {profile.buddyDetails?.destinations?.join(", ")}
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full" variant="outline">
            <MessageCircle className="h-4 w-4 mr-2" />
            Connect
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Connect with {profile.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send a message to {profile.name} to start your conversation.
            </p>
            <textarea
              placeholder="Write your message..."
              className="w-full p-2 border rounded-lg min-h-24 text-sm"
              id="messageInput"
            />
            <Button
              onClick={() => {
                const message = (document.getElementById("messageInput") as HTMLTextAreaElement).value;
                if (message.trim()) {
                  sendConnectionRequest(profile.id, message);
                  (document.getElementById("messageInput") as HTMLTextAreaElement).value = "";
                }
              }}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              Send Connection Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="max-w-[980px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h2 className="apple-headline text-4xl md:text-5xl text-black dark:text-white mb-3">Bhutan Connects Community</h2>
          <p className="text-muted-foreground text-lg">
            {isSupabaseEnabled() ? "🔗 Real-time connected • " : ""}Find your perfect host or travel buddy
          </p>
        </motion.div>

        {isLoading && (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
            <p className="text-muted-foreground">Loading travelers and hosts...</p>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Search & Filters */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Search Travelers & Hosts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Search by name or interests..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Filter by type</label>
                    <Select value={filterType} onValueChange={(value: any) => handleFilterType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="hosts">Hosts Only</SelectItem>
                        <SelectItem value="buddies">Travel Buddies Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={handleLocationFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {getLocations().map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">View</label>
                    <Button variant="outline" className="w-full" size="sm">
                      ❤️ Favorites ({favoriteUsers.length})
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{profiles.length}</div>
                  <div className="text-sm text-muted-foreground">Total Members</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{profiles.filter((p) => p.isHost).length}</div>
                  <div className="text-sm text-muted-foreground">Active Hosts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-3xl font-bold text-primary">{profiles.filter((p) => p.isLookingForBuddy).length}</div>
                  <div className="text-sm text-muted-foreground">Seeking Buddies</div>
                </CardContent>
              </Card>
            </div>

            {/* User Grid */}
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProfiles.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No users found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria or be the first to join!</p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectCommunity;
