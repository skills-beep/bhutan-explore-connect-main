import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import type { ConnectProfile } from "@/lib/types";

type ConnectionRequestRow = any;

const Messages = () => {
  const [currentProfile, setCurrentProfile] = useState<ConnectProfile | null>(null);
  const [requests, setRequests] = useState<ConnectionRequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("currentConnectProfile");
    if (saved) setCurrentProfile(JSON.parse(saved));
  }, []);

  const loadRequests = async () => {
    if (!currentProfile || !isSupabaseEnabled() || !supabase) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("connection_requests")
        .select("*, from_user:connect_profiles!from_user_id(*)")
        .or(`from_user_id.eq.${currentProfile.id},to_user_id.eq.${currentProfile.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests((data ?? []) as any);
    } catch (e: any) {
      console.error(e);
      toast({ title: "Error", description: "Failed to load requests", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRequests();

    if (!currentProfile || !isSupabaseEnabled() || !supabase) return;

    const channel = supabase
      .channel("connection_requests_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "connection_requests" },
        () => void loadRequests()
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile?.id]);

  const pendingReceived = useMemo(() => {
    if (!currentProfile) return [];
    return requests.filter((r) => r.to_user_id === currentProfile.id && r.status === "pending");
  }, [requests, currentProfile]);

  const history = useMemo(() => {
    return requests.filter((r) => r.status !== "pending");
  }, [requests]);

  const handleSetStatus = async (requestId: string, status: "accepted" | "rejected") => {
    if (!isSupabaseEnabled() || !supabase) return;

    const { error } = await supabase
      .from("connection_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to update request", variant: "destructive" });
      return;
    }

    toast({ title: "Success", description: `Request ${status}.` });
    await loadRequests();
  };

  if (!currentProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Please create your profile to view messages.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        <p className="text-muted-foreground">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      {pendingReceived.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              Pending Requests ({pendingReceived.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingReceived.map((req) => (
              <div key={req.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={(req.from_user as any)?.profilePhoto} />
                      <AvatarFallback>
                        {(req.from_user?.name ?? "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{req.from_user?.name ?? "Unknown"}</span>
                        <Badge variant="secondary" className="text-xs">
                          pending
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{new Date(req.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm bg-muted p-3 rounded-md">{req.message}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSetStatus(req.id as any, "accepted")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetStatus(req.id as any, "rejected")}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {history.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Previous Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.map((req) => (
              <div key={req.id} className="border rounded-lg p-4 space-y-2 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={(req.from_user as any)?.profilePhoto} />
                      <AvatarFallback>
                        {(req.from_user?.name ?? "?")
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{req.from_user?.name ?? "Unknown"}</span>
                        <Badge
                          variant={req.status === "accepted" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {req.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm bg-muted p-3 rounded-md">{req.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {pendingReceived.length === 0 && history.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No requests yet. Start connecting with hosts and travel buddies!</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default Messages;
