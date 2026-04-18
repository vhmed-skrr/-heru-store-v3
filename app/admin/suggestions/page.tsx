import { getSuggestions } from '@/lib/actions/adminSuggestions';
import { SuggestionsAdminClient } from '@/components/admin/SuggestionsAdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminSuggestionsPage() {
  const { data: suggestions, error } = await getSuggestions();

  if (error) {
    console.error('[AdminSuggestions] getSuggestions error:', error);
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-arabic text-text-main">اقتراحات العملاء</h1>
          <p className="text-text-sec text-sm mt-1 font-medium">
            جميع الاقتراحات المُرسلة من صفحة "اقترح تصميم" — يمكنك مراجعتها وتغيير حالتها أو حذفها
          </p>
        </div>
        <div className="flex items-center gap-2 bg-brand-50 border border-brand-200 rounded-lg px-4 py-2 text-sm font-bold text-brand-700">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          {suggestions?.length ?? 0} اقتراح
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 font-medium">
          خطأ في تحميل الاقتراحات: {error}
        </div>
      ) : (
        <SuggestionsAdminClient initialSuggestions={suggestions ?? []} />
      )}
    </div>
  );
}
