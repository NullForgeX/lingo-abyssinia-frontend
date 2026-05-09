import { getAdminUsersActivity } from "@/data/adminStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AdminUsers = () => {
  const users = getAdminUsersActivity();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">User Activity</h1>
      <p className="mt-2 text-sm text-muted-foreground">Monitor learner engagement and admin accounts.</p>

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Lessons Completed</TableHead>
              <TableHead>Streak</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role}</TableCell>
                <TableCell>{user.lessonsCompleted}</TableCell>
                <TableCell>{user.streak} days</TableCell>
                <TableCell>{new Date(user.lastActive).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsers;
