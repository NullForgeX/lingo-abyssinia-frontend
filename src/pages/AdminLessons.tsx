import { useEffect, useMemo, useState } from "react";
import {
  AdminLesson,
  AdminQuiz,
  deleteAdminLesson,
  deleteAdminQuiz,
  getAdminLessons,
  getAdminQuizzes,
  pushAdminAuditLog,
  upsertAdminLesson,
  upsertAdminQuiz,
} from "@/data/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_SIZE = 8;

const emptyForm = {
  title: "",
  language: "amharic" as const,
  level: "beginner" as const,
  status: "draft" as const,
};

const emptyQuizForm = {
  lessonId: "",
  language: "amharic" as const,
  question: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A" as const,
  explanation: "",
};

const AdminLessons = () => {
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [quizzes, setQuizzes] = useState<AdminQuiz[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [quizForm, setQuizForm] = useState(emptyQuizForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterLanguage, setFilterLanguage] = useState<"all" | AdminLesson["language"]>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | AdminLesson["status"]>("all");
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState<AdminLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLessons = async () => {
    setLoading(true);
    setError("");
    try {
      const [lessonData, quizData] = await Promise.all([getAdminLessons(), getAdminQuizzes()]);
      setLessons(lessonData);
      setQuizzes(quizData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load lessons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons();
  }, []);

  const filtered = useMemo(() => {
    return [...lessons]
      .filter((l) => (filterLanguage === "all" ? true : l.language === filterLanguage))
      .filter((l) => (filterStatus === "all" ? true : l.status === filterStatus))
      .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
  }, [lessons, filterLanguage, filterStatus, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const upsert = async () => {
    if (!form.title.trim()) return;

    try {
      const saved = await upsertAdminLesson({ id: editingId || undefined, ...form });
      await pushAdminAuditLog({ actor: "Admin", action: editingId ? "Updated lesson" : "Created lesson", target: form.title.trim() });
      setLessons((prev) => editingId ? prev.map((l) => l.id === editingId ? saved : l) : [saved, ...prev]);
      setForm(emptyForm);
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save lesson.");
    }
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

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteAdminLesson(toDelete.id);
      await pushAdminAuditLog({ actor: "Admin", action: "Deleted lesson", target: toDelete.title });
      setLessons((prev) => prev.filter((l) => l.id !== toDelete.id));
      setToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete lesson.");
    }
  };

  const upsertQuiz = async () => {
    if (!quizForm.question.trim() || !quizForm.optionA.trim() || !quizForm.optionB.trim()) return;

    try {
      const saved = await upsertAdminQuiz({
        id: editingQuizId || undefined,
        lessonId: quizForm.lessonId || null,
        language: quizForm.language,
        question: quizForm.question.trim(),
        optionA: quizForm.optionA.trim(),
        optionB: quizForm.optionB.trim(),
        optionC: quizForm.optionC.trim() || "Not sure",
        optionD: quizForm.optionD.trim() || "None of these",
        correctOption: quizForm.correctOption,
        explanation: quizForm.explanation.trim(),
      });
      await pushAdminAuditLog({ actor: "Admin", action: editingQuizId ? "Updated quiz" : "Created quiz", target: quizForm.question.trim() });
      setQuizzes((prev) => editingQuizId ? prev.map((quiz) => quiz.id === editingQuizId ? saved : quiz) : [saved, ...prev]);
      setQuizForm(emptyQuizForm);
      setEditingQuizId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save quiz. Run the admin_quizzes SQL patch if this is the first time.");
    }
  };

  const editQuiz = (quiz: AdminQuiz) => {
    setEditingQuizId(quiz.id);
    setQuizForm({
      lessonId: quiz.lessonId || "",
      language: quiz.language,
      question: quiz.question,
      optionA: quiz.optionA,
      optionB: quiz.optionB,
      optionC: quiz.optionC,
      optionD: quiz.optionD,
      correctOption: quiz.correctOption,
      explanation: quiz.explanation,
    });
  };

  const removeQuiz = async (quiz: AdminQuiz) => {
    try {
      await deleteAdminQuiz(quiz.id);
      await pushAdminAuditLog({ actor: "Admin", action: "Deleted quiz", target: quiz.question });
      setQuizzes((prev) => prev.filter((item) => item.id !== quiz.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete quiz.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-bold md:text-3xl">Lesson Management (CRUD)</h1>
      <p className="mt-2 text-sm text-muted-foreground">Create, edit, publish, delete, and filter lessons with paging.</p>
      {error && <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <h2 className="font-semibold">{editingId ? "Edit lesson" : "Create lesson"}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Input aria-label="Lesson title" placeholder="Lesson title" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
          <select
            aria-label="Lesson language"
            value={form.language}
            onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value as AdminLesson["language"] }))}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="amharic">Amharic</option>
            <option value="oromo">Afan Oromoo</option>
            <option value="tigrinya">Tigrinya</option>
          </select>
          <select
            aria-label="Lesson level"
            value={form.level}
            onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value as AdminLesson["level"] }))}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            aria-label="Lesson status"
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as AdminLesson["status"] }))}
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold">{editingQuizId ? "Edit quiz question" : "Add quiz question"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create multiple-choice questions and connect them to a Supabase lesson.</p>
          </div>
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">{quizzes.length} questions</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <select aria-label="Quiz lesson" value={quizForm.lessonId} onChange={(e) => setQuizForm((prev) => ({ ...prev, lessonId: e.target.value }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="">No linked lesson</option>
            {lessons.map((lesson) => <option key={lesson.id} value={lesson.id}>{lesson.title}</option>)}
          </select>
          <select aria-label="Quiz language" value={quizForm.language} onChange={(e) => setQuizForm((prev) => ({ ...prev, language: e.target.value as AdminQuiz["language"] }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="amharic">Amharic</option>
            <option value="oromo">Afan Oromoo</option>
            <option value="tigrinya">Tigrinya</option>
          </select>
          <Input className="md:col-span-2" aria-label="Quiz question" placeholder="Question, e.g. Which phrase means hello?" value={quizForm.question} onChange={(e) => setQuizForm((prev) => ({ ...prev, question: e.target.value }))} />
          <Input aria-label="Option A" placeholder="Option A" value={quizForm.optionA} onChange={(e) => setQuizForm((prev) => ({ ...prev, optionA: e.target.value }))} />
          <Input aria-label="Option B" placeholder="Option B" value={quizForm.optionB} onChange={(e) => setQuizForm((prev) => ({ ...prev, optionB: e.target.value }))} />
          <Input aria-label="Option C" placeholder="Option C" value={quizForm.optionC} onChange={(e) => setQuizForm((prev) => ({ ...prev, optionC: e.target.value }))} />
          <Input aria-label="Option D" placeholder="Option D" value={quizForm.optionD} onChange={(e) => setQuizForm((prev) => ({ ...prev, optionD: e.target.value }))} />
          <select aria-label="Correct option" value={quizForm.correctOption} onChange={(e) => setQuizForm((prev) => ({ ...prev, correctOption: e.target.value as AdminQuiz["correctOption"] }))} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="A">Correct: A</option>
            <option value="B">Correct: B</option>
            <option value="C">Correct: C</option>
            <option value="D">Correct: D</option>
          </select>
          <Input aria-label="Explanation" placeholder="Short explanation after answer" value={quizForm.explanation} onChange={(e) => setQuizForm((prev) => ({ ...prev, explanation: e.target.value }))} />
        </div>
        <div className="mt-4 flex gap-3">
          <Button onClick={upsertQuiz}>{editingQuizId ? "Update question" : "Add question"}</Button>
          {editingQuizId && <Button variant="outline" onClick={() => { setEditingQuizId(null); setQuizForm(emptyQuizForm); }}>Cancel</Button>}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <Input aria-label="Search lessons" placeholder="Search lessons..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          <select aria-label="Filter language" value={filterLanguage} onChange={(e) => { setFilterLanguage(e.target.value as any); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All languages</option>
            <option value="amharic">Amharic</option>
            <option value="oromo">Afan Oromoo</option>
            <option value="tigrinya">Tigrinya</option>
          </select>
          <select aria-label="Filter status" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as any); setPage(1); }} className="h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option value="all">All status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <div className="text-sm text-muted-foreground flex items-center">{filtered.length} results</div>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">Loading lessons...</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No lessons match current filters.</div>
        ) : (
          <>
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
                {pageData.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell className="capitalize">{lesson.language}</TableCell>
                    <TableCell className="capitalize">{lesson.level}</TableCell>
                    <TableCell className="capitalize">{lesson.status}</TableCell>
                    <TableCell>{new Date(lesson.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => editLesson(lesson)}>Edit</Button>
                        <Button size="sm" variant="destructive" onClick={() => setToDelete(lesson)}>Delete</Button>
                      </div>
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

      <div className="mt-6 rounded-2xl border border-border bg-card/95 p-5">
        <h2 className="font-semibold">All quiz questions</h2>
        <div className="mt-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Correct</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell className="max-w-md font-medium">{quiz.question}</TableCell>
                  <TableCell className="capitalize">{quiz.language}</TableCell>
                  <TableCell>{quiz.correctOption}</TableCell>
                  <TableCell>{new Date(quiz.updatedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editQuiz(quiz)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => removeQuiz(quiz)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {quizzes.length === 0 && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No admin-created quiz questions yet.</div>}
        </div>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This action removes <span className="font-medium">{toDelete?.title}</span>. You can recreate it later, but this row will be lost now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminLessons;
