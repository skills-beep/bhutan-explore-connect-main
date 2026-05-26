import { supabase, isSupabaseEnabled } from "./supabase";

// ============================================
// CONNECT PROFILES UTILITIES
// ============================================

export const connectProfiles = {
  async create(profile: {
    id: string;
    name: string;
    email: string;
    age: number;
    gender?: string;
    bio: string;
    is_host?: boolean;
    is_looking_for_buddy?: boolean;
  }) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connect_profiles")
      .insert([profile])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async getById(id: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connect_profiles")
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(
    id: string,
    updates: Record<string, any>
  ) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connect_profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getPublicProfiles(
    filters?: {
      is_host?: boolean;
      is_looking_for_buddy?: boolean;
    }
  ) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    let query = supabase!
      .from("connect_profiles")
      .select()
      .eq("profile_visibility", "public");

    if (filters?.is_host !== undefined) {
      query = query.eq("is_host", filters.is_host);
    }
    if (filters?.is_looking_for_buddy !== undefined) {
      query = query.eq("is_looking_for_buddy", filters.is_looking_for_buddy);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (error) throw error;
    return data;
  },

  // Subscribe to real-time updates
  subscribe(callback: (payload: any) => void) {
    if (!isSupabaseEnabled()) return () => {};
    const channel = supabase!
      .channel("public:connect_profiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "connect_profiles" },
        callback
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  },
};

// ============================================
// CONNECTION REQUESTS UTILITIES
// ============================================

export const connectionRequests = {
  async send(
    fromUserId: string,
    toUserId: string,
    message: string
  ) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connection_requests")
      .insert([{ from_user_id: fromUserId, to_user_id: toUserId, message }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async getReceivedRequests(userId: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connection_requests")
      .select(
        `
        *,
        from_user:connect_profiles!connection_requests_from_user_id_fkey(*)
      `
      )
      .eq("to_user_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getSentRequests(userId: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connection_requests")
      .select(
        `
        *,
        to_user:connect_profiles!connection_requests_to_user_id_fkey(*)
      `
      )
      .eq("from_user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async updateStatus(
    requestId: string,
    status: "accepted" | "rejected" | "blocked"
  ) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("connection_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .select();
    if (error) throw error;
    return data?.[0];
  },

  // Subscribe to real-time updates
  subscribe(userId: string, callback: (payload: any) => void) {
    if (!isSupabaseEnabled()) return () => {};
    const channel = supabase!
      .channel(`connection_requests:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "connection_requests",
          filter: `to_user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  },
};

// ============================================
// MESSAGES UTILITIES
// ============================================

export const messages = {
  async send(fromUserId: string, toUserId: string, content: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("messages")
      .insert([{ from_user_id: fromUserId, to_user_id: toUserId, content }])
      .select();
    if (error) throw error;
    return data?.[0];
  },

  async getConversation(userId: string, otherUserId: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("messages")
      .select()
      .or(
        `and(from_user_id.eq.${userId},to_user_id.eq.${otherUserId}),and(from_user_id.eq.${otherUserId},to_user_id.eq.${userId})`
      )
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  },

  async markAsRead(messageIds: string[]) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { error } = await supabase!
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .in("id", messageIds);
    if (error) throw error;
  },

  // Subscribe to real-time messages
  subscribe(userId: string, callback: (payload: any) => void) {
    if (!isSupabaseEnabled()) return () => {};
    const channel = supabase!
      .channel(`messages:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `to_user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  },
};

// ============================================
// PACKAGES UTILITIES
// ============================================

export const packages = {
  async getAll() {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("packages")
      .select()
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("packages")
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async getByDestination(destination: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("packages")
      .select()
      .eq("destination", destination)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};

// ============================================
// DESTINATIONS UTILITIES
// ============================================

export const destinations = {
  async getAll() {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("destinations")
      .select()
      .order("name");
    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    if (!isSupabaseEnabled()) throw new Error("Supabase not configured");
    const { data, error } = await supabase!
      .from("destinations")
      .select()
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },
};
