import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, CheckCircle, XCircle } from "lucide-react";

// Mock messages data
const mockMessages = [
  {
    id: 1,
    from: { name: "Tashi Dorji", avatar: "", verified: "ID verified" },
    type: "stay_request",
    subject: "Stay Request for Thimphu",
    message: "Hi! I'm traveling to Bhutan and would love to experience local hospitality in Thimphu. I'm respectful of cultural traditions and excited to learn about Bhutanese culture.",
    status: "pending",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    to: { name: "Emma Wilson", avatar: "", verified: "Email verified" },
    type: "buddy_request",
    subject: "Travel Buddy Request",
    message: "Hello! I saw your post about trekking in Paro and Thimphu. I'm also planning a similar trip and would love to connect. I have experience with cultural travel.",
    status: "accepted",
    timestamp: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    from: { name: "Sonam Wangchuk", avatar: "", verified: "Email verified" },
    type: "stay_request",
    subject: "Homestay Inquiry",
    message: "Namaste! I'm interested in your homestay in Paro. I practice meditation and would appreciate any guidance on local monasteries.",
    status: "pending",
    timestamp: "2024-01-16T09:15:00Z"
  }
];

const Messages = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [replyMessage, setReplyMessage] = useState("");
  const [activeMessage, setActiveMessage] = useState<number | null>(null);

  const handleResponse = (messageId: number, action: 'accept' | 'decline') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, status: action === 'accept' ? 'accepted' : 'declined' } : msg
    ));
    alert(`Request ${action}ed successfully!`);
  };

  const handleReply = (messageId: number) => {
    if (!replyMessage.trim()) return;

    // Mock reply - replace with API call
    console.log(`Replying to message ${messageId}: ${replyMessage}`);
    alert('Reply sent successfully!');
    setReplyMessage("");
    setActiveMessage(null);
  };

  const pendingMessages = messages.filter(m => m.status === 'pending');
  const respondedMessages = messages.filter(m => m.status !== 'pending');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Messages</h1>
      </div>

      {/* Pending Requests */}
      {pendingMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              Pending Requests ({pendingMessages.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingMessages.map((msg) => (
              <div key={msg.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={msg.from?.avatar} />
                      <AvatarFallback>{msg.from?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{msg.from?.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {msg.from?.verified}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm bg-muted p-3 rounded-md">{msg.message}</p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleResponse(msg.id, 'accept')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleResponse(msg.id, 'decline')}
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveMessage(activeMessage === msg.id ? null : msg.id)}
                  >
                    Reply
                  </Button>
                </div>

                {activeMessage === msg.id && (
                  <div className="flex gap-2 mt-3">
                    <Input
                      placeholder="Type your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => handleReply(msg.id)}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Responded Messages */}
      {respondedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Previous Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {respondedMessages.map((msg) => (
              <div key={msg.id} className="border rounded-lg p-4 space-y-3 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={msg.from?.avatar || msg.to?.avatar} />
                      <AvatarFallback>
                        {(msg.from?.name || msg.to?.name).split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{msg.from?.name || msg.to?.name}</span>
                        <Badge variant={msg.status === 'accepted' ? 'default' : 'secondary'} className="text-xs">
                          {msg.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.subject}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm bg-muted p-3 rounded-md">{msg.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {messages.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No messages yet. Start connecting with hosts and travel buddies!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Messages;