import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getCourse } from "@/data/courseContent";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { buildProgressBadges } from "@/lib/progressInsights";

const BadgeHistory = () => {
  const { user } = useAuth();
  const { progressRecords } = useLessonProgress();
  const course = getCourse(user?.selectedLanguage ?? "amharic");
  const totalLessons = course.units.flatMap((unit) => unit.lessons).length;
  const badges = useMemo(
    () => buildProgressBadges(progressRecords, user?.streak ?? 0, totalLessons),
    [progressRecords, user?.streak, totalLessons],
  );

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
          {badges.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-card px-4 py-6 text-sm text-muted-foreground">
              No badges earned yet. Complete a lesson to unlock your first badge.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeHistory;
