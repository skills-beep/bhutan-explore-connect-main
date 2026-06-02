import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Star, MessageCircle, Search, Heart, Calendar, Globe, LogIn, UserPlus, ArrowRight, Shield } from "lucide-react";
import { hosts, buddies, Host, Buddy } from "@/data/packages";
import Messages from "@/components/Messages";
import ConnectSignup from "@/components/ConnectSignup";
import ConnectCommunity from "@/components/ConnectCommunity";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import type { ConnectProfile } from "@/lib/types";

const BhutanConnectsPage = () => {
  const [hostSearch, setHostSearch] = useState("");
  const [buddySearch, setBuddySearch] = useState("");
  const [hostLocation, setHostLocation] = useState("all");
  const [buddyDestination, setBuddyDestination] = useState("all");
  const [currentProfile, setCurrentProfile] = useState<ConnectProfile | null>(null);
  const [profiles, setProfiles] = useState<ConnectProfile[]>([]);
  const [showSignup, setShowSignup] = useState(false);
  const [activeTab, setActiveTab] = useState("discover");

  const mapProfileRow = (row: any): ConnectProfile => ({
    id: row.id,
    name: row.name,
    email: row.email,
    age: row.age,
    gender: row.gender,
    bio: row.bio,
    profilePhoto: row.profile_photo,
    idCardScan: row.id_card_scan,
    facePhoto: row.face_photo,
    emailVerified: row.email_verified ?? false,
    travelGroupCode: row.travel_group_code,
    emergencyContactName: row.emergency_contact_name,
    emergencyContactPhone: row.emergency_contact_phone,
    languages: row.languages ?? [],
    interests: row.interests ?? [],
    verified: row.verified,
    isHost: row.is_host ?? false,
    isLookingForBuddy: row.is_looking_for_buddy ?? false,
    hostDetails: row.host_details,
    buddyDetails: row.buddy_details,
    createdAt: row.created_at,
    profileVisibility: row.profile_visibility ?? "public",
  });

  useEffect(() => {
    const saved = localStorage.getItem("currentConnectProfile");
    if (saved) {
      setCurrentProfile(JSON.parse(saved));
    }

    const loadProfiles = async () => {
      if (isSupabaseEnabled()) {
        const { data, error } = await supabase!.from("connect_profiles").select("*").order("created_at", { ascending: false });
        if (error) {
          console.error("Supabase profile fetch error:", error);
          const savedProfiles = JSON.parse(localStorage.getItem("connectProfiles") || "[]");
          setProfiles(savedProfiles);
          return;
        }
        setProfiles((data ?? []).map(mapProfileRow));
      } else {
        const savedProfiles = JSON.parse(localStorage.getItem("connectProfiles") || "[]");
        setProfiles(savedProfiles);
      }
    };

    void loadProfiles();

    let channel: any;

    if (isSupabaseEnabled()) {
      channel = supabase!.channel("public:connect_profiles").on(
        "postgres_changes",
        { event: "*", schema: "public", table: "connect_profiles" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setProfiles((prev) => [mapProfileRow(payload.new), ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updated = mapProfileRow(payload.new);
            setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          } else if (payload.eventType === "DELETE") {
            const deletedId = payload.old?.id;
            if (deletedId) setProfiles((prev) => prev.filter((p) => p.id !== deletedId));
          }
        }
      ).subscribe();
    }

    return () => {
      if (channel && isSupabaseEnabled()) {
        void supabase!.removeChannel(channel);
      }
    };
  }, []);

  const filteredHosts = hosts.filter(host => {
    const matchesSearch = host.name.toLowerCase().includes(hostSearch.toLowerCase()) ||
                         host.bio.toLowerCase().includes(hostSearch.toLowerCase()) ||
                         host.location.toLowerCase().includes(hostSearch.toLowerCase());
    const matchesLocation = hostLocation === "all" || host.location === hostLocation;
    return matchesSearch && matchesLocation;
  });

  const filteredBuddies = buddies.filter(buddy => {
    const matchesSearch = buddy.name.toLowerCase().includes(buddySearch.toLowerCase()) ||
                         buddy.bio.toLowerCase().includes(buddySearch.toLowerCase());
    const matchesDestination = buddyDestination === "all" ||
                              buddy.destinations.includes(buddyDestination);
    return matchesSearch && matchesDestination;
  });

  const handleConnect = (type: 'host' | 'buddy', id: string) => {
    if (!currentProfile) {
      alert("Please create your profile first!");
      setShowSignup(true);
      return;
    }
    alert(`Connection request sent to ${type === 'host' ? 'host' : 'buddy'}!`);
  };

  const HostCard = ({ host }: { host: Host }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border p-4 hover:shadow-card transition-all bg-gradient-to-br from-background to-secondary/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={host.profilePhoto} />
          <AvatarFallback className="text-xs font-bold">{host.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-sm font-semibold truncate text-black dark:text-white">{host.name}, {host.age}</h3>
            <Badge variant={host.verified === 'id' ? 'default' : 'secondary'} className="text-xs whitespace-nowrap flex-shrink-0">
              {host.verified === 'id' ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{host.location}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
            <span className="font-medium">{host.rating}</span>
            <span className="text-muted-foreground">({host.reviewCount})</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{host.bio}</p>

      <div className="space-y-1.5 mb-3 text-xs">
        <div>
          <span className="font-medium text-foreground">Space:</span> <span className="text-muted-foreground">{host.spaceType}</span>
        </div>
        <div>
          <span className="font-medium text-foreground">Max guests:</span> <span className="text-muted-foreground">{host.maxGuests}</span>
        </div>
        <div>
          <span className="font-medium text-foreground">Languages:</span> <span className="text-muted-foreground">{host.languages.join(', ')}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {host.interests.map(interest => (
          <Badge key={interest} variant="outline" className="text-xs py-0.5">
            {interest}
          </Badge>
        ))}
      </div>

      <Button
        onClick={() => handleConnect('host', host.id)}
        className="w-full text-xs h-8"
      >
        <Heart className="h-3 w-3 mr-1" />
        Request
      </Button>
    </motion.div>
  );

  const BuddyCard = ({ buddy }: { buddy: Buddy }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-border p-4 hover:shadow-card transition-all bg-gradient-to-br from-background to-secondary/5"
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-12 w-12 flex-shrink-0">
          <AvatarImage src={buddy.profilePhoto} />
          <AvatarFallback className="text-xs font-bold">{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h3 className="text-sm font-semibold truncate text-black dark:text-white">{buddy.name}, {buddy.age}</h3>
            <Badge variant={buddy.verified === 'id' ? 'default' : 'secondary'} className="text-xs whitespace-nowrap flex-shrink-0">
              {buddy.verified === 'id' ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{buddy.destinations.join(', ')}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2 leading-relaxed">{buddy.bio}</p>

      <div className="space-y-1.5 mb-3 text-xs">
        <div>
          <span className="font-medium text-foreground">Dates:</span> <span className="text-muted-foreground">{buddy.startDate} - {buddy.endDate}</span>
        </div>
        <div>
          <span className="font-medium text-foreground">Travel style:</span> <span className="text-muted-foreground">{buddy.travelStyle}</span>
        </div>
        <div>
          <span className="font-medium text-foreground">Languages:</span> <span className="text-muted-foreground">{buddy.languages.join(', ')}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-3">
        {buddy.activities.slice(0, 3).map(activity => (
          <Badge key={activity} variant="outline" className="text-xs py-0.5">
            {activity}
          </Badge>
        ))}
      </div>

      <Button
        onClick={() => handleConnect('buddy', buddy.id)}
        className="w-full text-xs h-8"
      >
        <MessageCircle className="h-3 w-3 mr-1" />
        Message
      </Button>
    </motion.div>
  );

  if (showSignup && !currentProfile) {
    return <ConnectSignup onProfileCreated={(profile) => {
      setCurrentProfile(profile);
      setShowSignup(false);
      setActiveTab("profile");
    }} />;
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen pt-20 pb-24 bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-[980px] mx-auto px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 py-8"
          >
            <h1 className="apple-headline text-3xl md:text-4xl text-foreground mb-2">Bhutan Connects</h1>
            <p className="text-muted-foreground text-sm md:text-base mb-6 font-light max-w-2xl mx-auto">
              Connect with authentic hosts and fellow travelers to share unforgettable Bhutan experiences
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 text-sm px-6"
              onClick={() => setShowSignup(true)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Create Profile
            </Button>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Find Hosts</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Stay with welcoming locals who share their culture and traditions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Travel Buddies</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Meet travelers, share experiences, reduce costs, and make friends
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <Shield className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Verified</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                All members verified for trust and safety in our community
              </p>
            </motion.div>
          </div>

          {/* Community Preview */}
          <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">Meet Our Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hosts.slice(0, 2).map((host) => (
                <HostCard key={host.id} host={host} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8 text-center border border-primary/20"
          >
            <h3 className="text-xl font-bold mb-2">Ready to Connect?</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Join hundreds of travelers creating authentic Bhutan experiences
            </p>
            <Button
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 text-sm px-6"
              onClick={() => setShowSignup(true)}
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Get Started
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24 bg-background">
      <div className="max-w-[980px] mx-auto px-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Welcome, {currentProfile.name}!</h1>
              <p className="text-muted-foreground text-xs md:text-sm font-light mt-1">
                Browse community and connect with hosts and travelers
              </p>
            </div>
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
                {currentProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 h-9">
<TabsTrigger value="discover" className="flex items-center gap-1 text-xs text-foreground">
              <Search className="h-3 w-3" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
<TabsTrigger value="community" className="flex items-center gap-1 text-xs text-foreground">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
<TabsTrigger value="messages" className="flex items-center gap-1 text-xs text-foreground">
              <MessageCircle className="h-3 w-3" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
<TabsTrigger value="profile" className="flex items-center gap-1 text-xs text-foreground">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hosts Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="rounded-xl border border-border bg-card p-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Heart className="h-4 w-4" />
                    Find Hosts
                  </h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search hosts..."
                      value={hostSearch}
                      onChange={(e) => setHostSearch(e.target.value)}
                      className="text-xs h-8"
                    />
                    <Select value={hostLocation} onValueChange={setHostLocation}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Thimphu">Thimphu</SelectItem>
                        <SelectItem value="Paro">Paro</SelectItem>
                        <SelectItem value="Punakha">Punakha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredHosts.map((host) => (
                    <HostCard key={host.id} host={host} />
                  ))}
                </div>
              </motion.div>

              {/* Buddies Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3"
              >
                <div className="rounded-xl border border-border bg-card p-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mb-3">
                    <Users className="h-4 w-4" />
                    Find Buddies
                  </h3>
                  <div className="space-y-2">
                    <Input
                      placeholder="Search buddies..."
                      value={buddySearch}
                      onChange={(e) => setBuddySearch(e.target.value)}
                      className="text-xs h-8"
                    />
                    <Select value={buddyDestination} onValueChange={setBuddyDestination}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue placeholder="Destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Destinations</SelectItem>
                        <SelectItem value="Paro">Paro</SelectItem>
                        <SelectItem value="Thimphu">Thimphu</SelectItem>
                        <SelectItem value="Punakha">Punakha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredBuddies.map((buddy) => (
                    <BuddyCard key={buddy.id} buddy={buddy} />
                  ))}
                </div>
              </motion.div>
            </div>
          </TabsContent>

          {/* Community Tab */}
          <TabsContent value="community">
            <ConnectCommunity />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Messages />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-6">Your Profile</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <Avatar className="h-20 w-20 flex-shrink-0">
                  <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
                    {currentProfile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-base font-bold">{currentProfile.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{currentProfile.email}</p>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div>
                      <span className="font-medium text-foreground">Age:</span> <span className="text-muted-foreground">{currentProfile.age}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Gender:</span> <span className="text-muted-foreground">{currentProfile.gender}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-foreground">Bio:</span> <span className="text-muted-foreground">{currentProfile.bio}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="text-xs h-8">Edit Profile</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BhutanConnectsPage;