import { Shell, Card, Input, Btn } from "@/components/ui";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  async function action(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    const res = await signIn(email, password);
    if (!res.ok) return;
    redirect(searchParams?.next || "/app");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-md">
        <Card title="تسجيل الدخول (Enterprise)">
          <form action={action} className="space-y-3">
            <div><label className="text-sm text-slate-600">البريد</label><Input name="email" required /></div>
            <div><label className="text-sm text-slate-600">كلمة المرور</label><Input name="password" type="password" required /></div>
            <div className="pt-2 flex items-center justify-between">
              <Btn type="submit">دخول</Btn>
              <div className="text-xs text-slate-500">admin@alrakeen.local / Admin@1234</div>
            </div>
          </form>
        </Card>
      </div>
    </Shell>
  );
}
