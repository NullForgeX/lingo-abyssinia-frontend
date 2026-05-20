import { useEffect, useMemo, useState } from "react";
import { AdminUserActivity, getAdminUsersActivity, pushAdminAuditLog, updateAdminUserRole } from "@/data/adminStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 8;

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUserActivity[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "learner" | "admin">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError("");
      try {
        setUsers(await getAdminUsersActivity());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    return users
      .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
      .filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => +new Date(b.lastActive) - +new Date(a.lastActive));
  }, [users, roleFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateRole = async (id: string, role: "learner" | "admin") => {
    const target = users.find((u) => u.id === id);
    try {
      await updateAdminUserRole(id, role);
      await pushAdminAuditLog({ actor: "Admin", action: `Changed role to ${role}`, target: target?.email || id });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update role.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">User Activity & Roles</h1>
      <p className="mt-2 text-sm text-muted-foreground">Monitor learners, filter activity, and manage roles safely.</p>
      {error && <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-3">
          <Input aria-label="Search users" placeholder="Search by name or email" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select aria-label="Filter by role" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value as any); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All roles</option>
            <option value="learner">Learners</option>
            <option value="admin">Admins</option>
          </select>
          <div className="text-sm text-muted-foreground flex items-center">{filtered.length} results</div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading users...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No users match current filters.</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Lessons Completed</TableHead>
                  <TableHead>Streak</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Role Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="capitalize">{user.role}</TableCell>
                    <TableCell>{user.lessonsCompleted}</TableCell>
                    <TableCell>{user.streak} days</TableCell>
                    <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <select
                        aria-label={`Change role for ${user.email}`}
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value as "learner" | "admin")}
                        className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                      >
                        <option value="learner">learner</option>
                        <option value="admin">admin</option>
                      </select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
