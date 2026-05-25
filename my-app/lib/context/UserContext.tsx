"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
}

const UserContext = createContext<UserProfile | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (data) {
        const firstName = data.first_name;
        const lastName = data.last_name;
        setProfile({
          id: user.id,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`.trim(),
        });
      }
    }
    loadProfile();
  }, []);

  return <UserContext.Provider value={profile}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
