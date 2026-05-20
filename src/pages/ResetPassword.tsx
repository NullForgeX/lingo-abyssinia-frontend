import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "@/api/supabaseAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setMessage("");
    try {
      await updatePassword(data.password);
      setDone(true);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl font-bold text-foreground">Reset Password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a new password for your account.
        </p>

        {!done ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {message && (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {message}
              </p>
            )}
            <div>
              <Label htmlFor="password">New Password</Label>
              <Input id="password" type="password" {...register("password")} className="mt-1.5" />
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1.5" />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
              Password reset successful.
            </p>
            <Link to="/login" className="text-sm font-medium text-primary hover:underline">
              Continue to login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
