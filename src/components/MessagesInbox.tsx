import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Check, X, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import type { ConnectProfile } from "@/lib/types";

interface ConnectionRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  from_user?: ConnectProfile;
  to_user?: ConnectProfile;
}

interface Message {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message: string;
  created_at: string;
  from_user?: ConnectProfile;
}

const MessagesInbox = () => {
  const [currentProfile, setCurrentProfile] = useState<ConnectProfile | null>(null);
  const [receivedRequests, setReceivedRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("currentConnectProfile");
    if (saved) {
      setCurrentProfile(JSON.parse(saved));
    }

    loadData();
  }, []);

  useEffect(() => {
    if (!currentProfile) return;

    let requestChannel: any;
    let messageChannel: any;

    if (isSupabaseEnabled()) {
      // Subscribe to connection requests
      requestChannel = supabase!.channel("connection_requests_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "connection_requests" },
          () => {
            loadData();
          }
        )
        .subscribe();

      // Subscribe to messages
      messageChannel = supabase!.channel("messages_changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          () => {
            loadData();
          }
        )
        .subscribe();
    }

    return () => {
      if (requestChannel && isSupabaseEnabled()) {
        void supabase!.removeChannel(requestChannel);
      }
      if (messageChannel && isSupabaseEnabled()) {
        void supabase!.removeChannel(messageChannel);
      }
    };
  }, [currentProfile]);

  const loadData = async () => {
    if (!currentProfile) return;

    setIsLoading(true);

    // Load received requests
    if (isSupabaseEnabled()) {
      const { data: recReqs, error: recErr } = await supabase!
        .from("connection_requests")
        .select(`*, from_user:connect_profiles!from_user_id(*)`)
        .eq("to_user_id", currentProfile.id);

      if (!recErr) {
        setReceivedRequests(recReqs || []);
      }

      // Load sent requests
      const { data: sentReqs, error: sentErr } = await supabase!
        .from("connection_requests")
        .select(`*, to_user:connect_profiles!to_user_id(*)`)
        .eq("from_user_id", currentProfile.id);

      if (!sentErr) {
        setSentRequests(sentReqs || []);
      }

      // Load messages
      const { data: msgs, error: msgErr } = await supabase!
        .from("messages")
        .select(`*, from_user:connect_profiles!from_user_id(*)`)
        .or(
          `from_user_id.eq.${currentProfile.id},to_user_id.eq.${currentProfile.id}`
        )
        .order("created_at", { ascending: false });

      if (!msgErr) {
        setMessages(msgs || []);
      }
    } else {
      // Fallback to localStorage
      const reqs = JSON.parse(
        localStorage.getItem("connectionRequests") || "[]"
      );
      const receivedReqs = reqs.filter((r: any) => r.to === currentProfile.id);
      const sentReqs = reqs.filter((r: any) => r.from === currentProfile.id);
      setReceivedRequests(receivedReqs);
      setSentRequests(sentReqs);
    }

    setIsLoading(false);
  };

  const handleAcceptRequest = async (requestId: string) => {
    if (!isSupabaseEnabled()) {
      toast({
        title: "Not Available",
        description: "Supabase must be configured to accept requests",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase!
      .from("connection_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive",
      });
    } else {
      toast({ title: "Success", description: "Request accepted!" });
      loadData();
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    if (!isSupabaseEnabled()) return;

    const { error } = await supabase!
      .from("connection_requests")
      .update({ status: "rejected" })
      .eq("id", requestId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
    } else {
      toast({ title: "Request rejected" });
      loadData();
    }
  };

  const handleSendMessage = async (toUserId: string) => {
    if (!currentProfile || !messageText.trim()) return;

    const newMessage = {
      from_user_id: currentProfile.id,
      to_user_id: toUserId,
      message: messageText,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseEnabled()) {
      const { error } = await supabase!
        .from("messages")
        .insert([newMessage]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        });
        return;
      }
    }

    setMessageText("");
    toast({ title: "Message sent!" });
    loadData();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading your messages...</p>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">
          Please create a profile to view messages
        </p>
      </div>
    );
  }

  const conversationPartners = Array.from(
    new Set([
      ...receivedRequests
        .filter((r) => r.status === "accepted")
        .map((r) => r.from_user_id),
      ...sentRequests
        .filter((r) => r.status === "accepted")
        .map((r) => r.to_user_id),
    ])
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Your Messages</h1>
          <p className="text-muted-foreground">
            Manage your connection requests and chat with matches
          </p>
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">
              Requests ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent">Sent ({sentRequests.length})</TabsTrigger>
            <TabsTrigger value="messages">
              Messages ({messages.length})
            </TabsTrigger>
          </TabsList>

          {/* Received Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {receivedRequests.length === 0 ? (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  No connection requests yet
                </p>
              </Card>
            ) : (
              <AnimatePresence>
                {receivedRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={req.from_user?.profilePhoto}
                            />
                            <AvatarFallback>
                              {req.from_user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {req.from_user?.name}, {req.from_user?.age}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {req.status === "pending" && (
                                  <Clock className="w-3 h-3 mr-1" />
                                )}
                                {req.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {req.message}
                            </p>
                            <p className="text-xs text-muted-foreground mb-4">
                              {new Date(req.created_at).toLocaleDateString()}
                            </p>
                            {req.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleAcceptRequest(req.id)
                                  }
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleRejectRequest(req.id)
                                  }
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>

          {/* Sent Requests Tab */}
          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  No requests sent yet
                </p>
              </Card>
            ) : (
              <AnimatePresence>
                {sentRequests.map((req) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={req.to_user?.profilePhoto} />
                            <AvatarFallback>
                              {req.to_user?.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {req.to_user?.name}, {req.to_user?.age}
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                {req.status === "pending" && (
                                  <Clock className="w-3 h-3 mr-1" />
                                )}
                                {req.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {req.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Sent{" "}
                              {new Date(req.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4">
            {conversationPartners.length === 0 ? (
              <Card className="p-8">
                <p className="text-center text-muted-foreground">
                  Accept a connection request to start chatting
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Conversations List */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Conversations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ScrollArea className="h-96">
                      {conversationPartners.map((partnerId) => {
                        const partnerReq =
                          receivedRequests.find(
                            (r) => r.from_user_id === partnerId
                          ) ||
                          sentRequests.find(
                            (r) => r.to_user_id === partnerId
                          );
                        const partner =
                          partnerReq?.from_user || partnerReq?.to_user;

                        return (
                          <button
                            key={partnerId}
                            onClick={() =>
                              setSelectedConversation(partnerId)
                            }
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedConversation === partnerId
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }`}
                          >
                            <p className="font-medium text-sm">
                              {partner?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {partner?.age} • {partner?.bio?.substring(0, 30)}...
                            </p>
                          </button>
                        );
                      })}
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Chat Area */}
                {selectedConversation && (
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Chat with{" "}
                        {
                          (receivedRequests.find(
                            (r) => r.from_user_id === selectedConversation
                          )?.from_user ||
                            sentRequests.find(
                              (r) => r.to_user_id === selectedConversation
                            )?.to_user)?.name
                        }
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ScrollArea className="h-64 border rounded-lg p-4 bg-muted/30">
                        <div className="space-y-3">
                          {messages
                            .filter(
                              (m) =>
                                (m.from_user_id === selectedConversation ||
                                  m.to_user_id === selectedConversation) &&
                                (m.from_user_id === currentProfile.id ||
                                  m.to_user_id === currentProfile.id)
                            )
                            .map((msg) => (
                              <div
                                key={msg.id}
                                className={`flex ${
                                  msg.from_user_id === currentProfile.id
                                    ? "justify-end"
                                    : "justify-start"
                                }`}
                              >
                                <div
                                  className={`max-w-xs px-4 py-2 rounded-lg ${
                                    msg.from_user_id === currentProfile.id
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted"
                                  }`}
                                >
                                  <p className="text-sm">{msg.message}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {new Date(
                                      msg.created_at
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </ScrollArea>

                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="resize-none"
                          rows={2}
                        />
                        <Button
                          onClick={() =>
                            handleSendMessage(selectedConversation)
                          }
                          size="icon"
                          className="h-auto"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default MessagesInbox;
