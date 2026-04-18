"use client";

/**
 * DeleteCategoryButton — Client Component
 *
 * WHY a separate component is needed:
 * The parent `app/admin/categories/page.tsx` is a Server Component (async function).
 * Server Components cannot use browser APIs like `window.confirm`.
 * The old code had `onClick={() => window.confirm(...)}` directly inside a
 * Server Component → Next.js threw "ReferenceError: window is not defined"
 * during server rendering → "حدث خطأ غير متوقع" for the entire page.
 *
 * By extracting the confirmation into this Client Component, the Server Component
 * remains pure and this component runs only in the browser.
 */

import { useTransition } from "react";
import { deleteCategory } from "@/lib/actions/adminCategories";

interface Props {
  categoryId: string;
  categoryName: string;
}

export function DeleteCategoryButton({ categoryId, categoryName }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    if (
      !window.confirm(
        `هل أنت متأكد من حذف تصنيف "${categoryName}" نهائياً؟\nلا يمكن التراجع عن هذه العملية.`
      )
    ) {
      return;
    }

    startTransition(async () => {
      await deleteCategory(categoryId);
      // deleteCategory already calls revalidatePath inside the server action
      // so the page will re-fetch automatically after the server action completes.
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      title="حذف"
      className="w-8 h-8 flex items-center justify-center rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      )}
    </button>
  );
}
