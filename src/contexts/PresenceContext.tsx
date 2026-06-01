import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

type PresenceContextValue = {
  activeLearners: number;
};

const PresenceContext = createContext<PresenceContextValue>({ activeLearners: 0 });

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activeLearners, setActiveLearners] = useState(0);

  useEffect(() => {
    if (!user || user.role !== "learner") {
      setActiveLearners(0);
      return;
    }

    const channel = supabase.channel("site-active-learners", {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    const updateActiveLearners = () => {
      setActiveLearners(Object.keys(channel.presenceState()).length);
    };

    channel
      .on("presence", { event: "sync" }, updateActiveLearners)
      .on("presence", { event: "join" }, updateActiveLearners)
      .on("presence", { event: "leave" }, updateActiveLearners)
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: user.id,
            name: user.name || user.email,
            onlineAt: new Date().toISOString(),
          });
          updateActiveLearners();
        }
      });

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
    };
  }, [user?.email, user?.id, user?.name, user?.role]);

  const value = useMemo(() => ({ activeLearners }), [activeLearners]);

  return (
    <PresenceContext.Provider value={value}>
      {children}
    </PresenceContext.Provider>
  );
};

export const usePresence = () => useContext(PresenceContext);
