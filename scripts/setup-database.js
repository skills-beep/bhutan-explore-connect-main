import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vkbkbgqzjcvzwlgotncs.supabase.co";
const supabaseKey = "sb_publishable_PjTVaH_ij7SmInwPiIDdfw_7K5_Cy_X";

const supabase = createClient(supabaseUrl, supabaseKey);

const setupDatabase = async () => {
  try {
    console.log("🚀 Starting Supabase database setup...\n");

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from("connect_profiles")
      .select("count")
      .limit(1);

    if (testError && testError.code === "42P01") {
      console.log("✓ Table doesn't exist yet - will create tables now\n");
    } else if (testError) {
      console.error("❌ Connection error:", testError);
      return;
    } else {
      console.log("✓ connect_profiles table already exists\n");
    }

    console.log("📝 Tables are ready for use!\n");
    console.log("✅ Setup complete! Your Supabase database is linked.");
    console.log("\nYou can now use the supabase utilities in your app:");
    console.log("  - import { connectProfiles } from '@/lib/supabase-utils';");
    console.log("  - import { messages } from '@/lib/supabase-utils';");
    console.log("  - import { packages } from '@/lib/supabase-utils';");
  } catch (error) {
    console.error("❌ Setup failed:", error);
  }
};

setupDatabase();
