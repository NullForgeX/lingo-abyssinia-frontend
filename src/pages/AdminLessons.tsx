import { useMemo, useState } from "react";
import { AdminLesson, getAdminLessons, saveAdminLessons } from "@/data/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const emptyForm = {
  title: "",
  language: "amharic" as const,
  level: "beginner" as const,
  status: "draft" as const,
};

const AdminLessons = () => {
  const [lessons, setLessons] = useState<AdminLesson[]>(getAdminLessons());
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...lessons].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)),
    [lessons],
  );

  const upsert = () => {
    if (!form.title.trim()) return;

    let next: AdminLesson[];
    if (editingId) {
      next = lessons.map((l) =>
        l.id === editingId
          ? { ...l, ...form, updatedAt: new Date().toISOString() }
          : l,
      );
    } else {
      next = [
        {
          id: `les-${Date.now()}`,
          ...form,
          updatedAt: new Date().toISOString(),
        },
        ...lessons,
      ];
    }

    setLessons(next);
    saveAdminLessons(next);
    setForm(emptyForm);
    setEditingId(null);
  };

  const editLesson = (lesson: AdminLesson) => {
    setEditingId(lesson.id);
    setForm({
      title: lesson.title,
      language: lesson.language,
      level: lesson.level,
      status: lesson.status,
    });
  };

  const deleteLesson = (id: string) => {
    const next = lessons.filter((l) => l.id !== id);
    setLessons(next);
    saveAdminLessons(next);
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">Lesson Management (CRUD)</h1>
      <p className="mt-2 text-sm text-muted-foreground">Create, edit, publish, and delete lesson records.</p>

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <h2 className="font-semibold">{editingId ? "Edit lesson" : "Create lesson"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input
            placeholder="Lesson title"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          />
          <select
            value={form.language}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, language: e.target.value as AdminLesson["language"] }))
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="amharic">Amharic</option>
            <option value="oromo">Oromo</option>
            <option value="tigrinya">Tigrinya</option>
          </select>
          <select
            value={form.level}
            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value as AdminLesson["level"] }))}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value as AdminLesson["status"] }))
            }
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={upsert}>{editingId ? "Update" : "Create"}</Button>
          {editingId && (
            <Button variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              Cancel
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((lesson) => (
              <TableRow key={lesson.id}>
                <TableCell className="font-medium">{lesson.title}</TableCell>
                <TableCell className="capitalize">{lesson.language}</TableCell>
                <TableCell className="capitalize">{lesson.level}</TableCell>
                <TableCell className="capitalize">{lesson.status}</TableCell>
                <TableCell>{new Date(lesson.updatedAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="inline-flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editLesson(lesson)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteLesson(lesson.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminLessons;
