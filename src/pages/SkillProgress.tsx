import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { getCourse } from "@/data/courseContent";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { buildSkillScores } from "@/lib/progressInsights";

const chartConfig: ChartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

const SkillProgress = () => {
  const { user } = useAuth();
  const { completedLessons } = useLessonProgress();
  const course = getCourse(user?.selectedLanguage ?? "amharic");
  const chartData = useMemo(
    () => buildSkillScores(course, completedLessons),
    [course, completedLessons],
  );

  return (
    <div className="mx-auto max-w-5xl pb-20 md:pb-0">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Per-Skill Progress</h1>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">
          Back
        </Link>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Skill performance overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[340px] w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="skill" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="score" radius={8} fill="var(--color-score)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillProgress;
