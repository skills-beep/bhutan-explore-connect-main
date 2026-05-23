import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Users, Star, MessageCircle, Search, Heart, Calendar, Globe, LogIn, UserPlus, ArrowRight } from "lucide-react";
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

    loadProfiles();

    let channel: any;
    if (isSupabaseEnabled()) {
      channel = supabase!.channel("public:connect_profiles")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "connect_profiles" },
          (payload) => {
            setProfiles((prev) => [mapProfileRow(payload.new), ...prev]);
          }
        )
        .subscribe();
    }

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
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
      className="rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-300 bg-gradient-to-br from-background to-secondary/5"
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={host.profilePhoto} />
          <AvatarFallback className="text-lg">{host.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{host.name}, {host.age}</h3>
            <Badge variant={host.verified === 'id' ? 'default' : 'secondary'} className="text-xs">
              {host.verified === 'id' ? 'ID Verified' : host.verified === 'email' ? 'Email Verified' : 'Unverified'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4" />
            {host.location}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{host.rating}</span>
            <span className="text-muted-foreground">({host.reviewCount})</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{host.bio}</p>

      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <span className="font-medium">Space:</span> {host.spaceType}
        </div>
        <div className="text-sm">
          <span className="font-medium">Max guests:</span> {host.maxGuests}
        </div>
        <div className="text-sm">
          <span className="font-medium">Languages:</span> {host.languages.join(', ')}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {host.interests.map(interest => (
          <Badge key={interest} variant="outline" className="text-xs">
            {interest}
          </Badge>
        ))}
      </div>

      <Button
        onClick={() => handleConnect('host', host.id)}
        className="w-full"
      >
        <Heart className="h-4 w-4 mr-2" />
        Send Stay Request
      </Button>
    </motion.div>
  );

  const BuddyCard = ({ buddy }: { buddy: Buddy }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border p-6 hover:shadow-card transition-all duration-300 bg-gradient-to-br from-background to-secondary/5"
    >
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={buddy.profilePhoto} />
          <AvatarFallback className="text-lg">{buddy.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold">{buddy.name}, {buddy.age}</h3>
            <Badge variant={buddy.verified === 'id' ? 'default' : 'secondary'} className="text-xs">
              {buddy.verified === 'id' ? 'ID Verified' : buddy.verified === 'email' ? 'Email Verified' : 'Unverified'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Globe className="h-4 w-4" />
            {buddy.destinations.join(', ')}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{buddy.bio}</p>

      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <span className="font-medium">Travel dates:</span> {buddy.startDate} to {buddy.endDate}
        </div>
        <div className="text-sm">
          <span className="font-medium">Looking for:</span> {buddy.companionAge} {buddy.companionGender}
        </div>
        <div className="text-sm">
          <span className="font-medium">Style:</span> {buddy.travelStyle}
        </div>
        <div className="text-sm">
          <span className="font-medium">Languages:</span> {buddy.languages.join(', ')}
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {buddy.activities.map(activity => (
          <Badge key={activity} variant="outline" className="text-xs">
            {activity}
          </Badge>
        ))}
      </div>

      <Button onClick={() => handleConnect('buddy', buddy.id)} className="w-full">
        <MessageCircle className="h-4 w-4 mr-2" />
        Send Buddy Request
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
            className="text-center mb-16 py-12"
          >
            <h1 className="apple-headline text-5xl md:text-6xl text-foreground mb-4">Bhutan Connects</h1>
            <p className="text-muted-foreground text-xl mb-8 font-light">
              Connect with authentic hosts and fellow travelers to share unforgettable Bhutan experiences
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 text-lg"
              onClick={() => setShowSignup(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create Your Profile
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Find Authentic Hosts</h3>
              <p className="text-muted-foreground text-sm">
                Stay with welcoming locals who share their culture, traditions, and hidden gems of Bhutan
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Find Travel Buddies</h3>
              <p className="text-muted-foreground text-sm">
                Meet like-minded travelers, share experiences, reduce costs, and create lasting friendships
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-card transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified & Safe</h3>
              <p className="text-muted-foreground text-sm">
                All members are verified. Connect with trust and confidence in our community
              </p>
            </motion.div>
          </div>

          {/* Preview Cards */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Community</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-12 text-center border border-primary/20"
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Connect?</h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Join hundreds of travelers and hosts creating authentic Bhutan experiences
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80"
              onClick={() => setShowSignup(true)}
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Get Started Today
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
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="apple-headline text-4xl md:text-6xl text-foreground">Welcome back, {currentProfile.name}!</h1>
              <p className="text-muted-foreground text-lg font-light mt-2">
                Browse our community and connect with hosts and travel buddies
              </p>
            </div>
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {currentProfile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Discover</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Discover Tab */}
          <TabsContent value="discover" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hosts Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Find Hosts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Search hosts..."
                      value={hostSearch}
                      onChange={(e) => setHostSearch(e.target.value)}
                    />
                    <Select value={hostLocation} onValueChange={setHostLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        <SelectItem value="Thimphu">Thimphu</SelectItem>
                        <SelectItem value="Paro">Paro</SelectItem>
                        <SelectItem value="Punakha">Punakha</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {filteredHosts.map((host) => (
                    <HostCard key={host.id} host={host} />
                  ))}
                </div>
              </motion.div>

              {/* Buddies Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Find Buddies
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Search buddies..."
                      value={buddySearch}
                      onChange={(e) => setBuddySearch(e.target.value)}
                    />
                    <Select value={buddyDestination} onValueChange={setBuddyDestination}>
                      <SelectTrigger>
                        <SelectValue placeholder="Destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="Paro">Paro</SelectItem>
                        <SelectItem value="Thimphu">Thimphu</SelectItem>
                        <SelectItem value="Punakha">Punakha</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <div className="space-y-4">
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
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {currentProfile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{currentProfile.name}</h3>
                    <p className="text-muted-foreground">{currentProfile.email}</p>
                    <Button variant="outline" className="mt-4">Edit Profile</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

import { Shield } from "lucide-react";

export default BhutanConnectsPage;