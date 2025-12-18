import { updateProfileStats } from "@/utils/updateProfileStats";

const { data: { session } } = await supabase.auth.getSession();
await updateProfileStats(session.user.id);
