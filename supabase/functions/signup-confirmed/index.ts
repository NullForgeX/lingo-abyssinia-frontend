import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Supabase service role is not configured" }, 500);
    }

    const { name, email, password } = await req.json();
    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!cleanName || !cleanEmail || typeof password !== "string" || password.length < 8) {
      return json({ error: "Name, email, and password are required" }, 400);
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
      user_metadata: { name: cleanName },
    });

    if (createError) {
      const alreadyExists = createError.message.toLowerCase().includes("already") || createError.status === 422;
      if (!alreadyExists) return json({ error: createError.message }, createError.status || 400);
    }

    if (created.user?.id) {
      await adminClient.from("profiles").upsert({
        id: created.user.id,
        name: cleanName,
        email: cleanEmail,
        role: cleanEmail === "admin@lingoabyssinia.com" ? "admin" : "learner",
        selected_language: "amharic",
        daily_goal: 15,
        onboarded: false,
      });
    }

    return json({ ok: true });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unknown error" }, 500);
  }
});
