import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StreakHistory = () => {
  const { user } = useAuth();
  const currentStreak = user?.streak ?? 0;

  const history = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => {
        const daysAgo = 13 - i;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const active = i > Math.max(0, 13 - currentStreak);
        return {
          key: date.toISOString(),
          label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          active,
        };
      }),
    [currentStreak],
  );

  return (
    <div className="mx-auto max-w-4xl pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Streak History</h1>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Last 14 days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {history.map((day) => (
              <div
                key={day.key}
                className={`rounded-lg border px-3 py-4 text-center text-sm ${
                  day.active ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-muted/30 text-muted-foreground"
                }`}
              >
                <p className="font-semibold">{day.label}</p>
                <p className="mt-1 text-xs">{day.active ? "Active" : "Missed"}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StreakHistory;
