import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const badges = [
  { id: "b1", name: "First Lesson", description: "Complete your first lesson", earnedAt: "2026-04-12" },
  { id: "b2", name: "7-Day Streak", description: "Practice for 7 days", earnedAt: "2026-04-21" },
  { id: "b3", name: "Vocabulary Starter", description: "Learn 50 words", earnedAt: "2026-05-02" },
  { id: "b4", name: "Quiz Master", description: "Score 90% on 5 quizzes", earnedAt: "2026-05-07" },
];

const BadgeHistory = () => {
  return (
    <div className="mx-auto max-w-4xl pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Badge History</h1>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Earned badges</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {badges.map((badge) => (
            <div key={badge.id} className="rounded-lg border border-border bg-card px-4 py-3">
              <p className="font-semibold text-foreground">{badge.name}</p>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Earned on {new Date(badge.earnedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeHistory;
