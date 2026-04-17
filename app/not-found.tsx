import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="text-brand-600 mb-6 bg-brand-50 p-6 rounded-full inline-flex">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" />
          <line x1="15" y1="9" x2="15.01" y2="9" />
        </svg>
      </div>
      <h1 className="text-4xl font-bold text-text mb-4">عفواً، الصفحة غير موجودة</h1>
      <p className="text-text-sec mb-8 max-w-md">
        يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التأكد من الرابط أو العودة للصفحة الرئيسية.
      </p>
      <Link href="/" className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
        العودة للرئيسية
      </Link>
    </div>
  );
}
