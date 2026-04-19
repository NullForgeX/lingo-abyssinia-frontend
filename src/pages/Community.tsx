import { motion } from "framer-motion";
import CommunityForum from "@/components/CommunityForum";

const Community = () => {
  return (
    <div className="pb-20 md:pb-0">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/12 via-secondary/10 to-background p-6 md:p-8"
      >
        <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
        <div className="absolute -left-14 bottom-0 h-36 w-36 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Learner Network
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground md:text-4xl">
            Community
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Ask questions, share study tips, and get help from other learners
            across Amharic, Afan Oromoo, and Tigrinya.
          </p>
        </div>
      </motion.div>

      <CommunityForum />
    </div>
  );
};

export default Community;
