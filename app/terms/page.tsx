import React from 'react';

export const metadata = {
  title: 'شروط الإستخدام والأحكام | Heru Store',
  description: 'تعرف على شروط استخدام المتجر، وسياسات الشحن والارجاع والتبديل الخاصة بنا.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm">
        <h1 className="text-3xl md:text-4xl font-black font-arabic text-text-main mb-6">شروط الاستخدام والأحكام</h1>
        <div className="text-sm text-text-sec mb-10 font-bold bg-bg-secondary inline-block px-4 py-2 rounded-lg">
          تاريخ آخر تحديث: أبريل 2026
        </div>

        <div className="space-y-10 text-text-main leading-relaxed font-medium">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">1</span>
              سياسة الإرجاع والاستبدال
            </h2>
            <p className="mb-3 text-text-sec">
              في إطار تقديمنا لتجربة مرضية بالكامل وجودة بلا تنازلات، نكفل للمشتري حق الإرجاع والاستبدال وفقاً لقانون حماية المستهلك المصري بناءً على المعايير التالية:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-main mt-4 pr-4 bg-bg-secondary p-5 rounded-xl border border-border">
              <li><strong>المدة الزمنية:</strong> يحق لك طلب إعادة المنتج واسترداد أموالك، أو استبداله بمقاس أو لون أو أداة أخرى خلال <strong>14 يوماً</strong> من تاريخ استلام الشحنة.</li>
              <li><strong>حالة المنتج:</strong> يجب أن يكون المنتج في حالته الأصلية، بالعبوة، بطاقات الأسعار المرفقة، وبدون أي علامات عن الاستخدام أو الكي أو الغسيل أو العطور.</li>
              <li><strong>الاستثناءات:</strong> المنتجات المُفصلة والمصنعة خصيصاً للمستخدم (Custom designs)، أو المنتجات المعيبة لسوء الاستخدام لا تخضع لسياسة الإرجاع.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">2</span>
              شروط الشحن والتوصيل
            </h2>
            <p className="text-text-sec mb-4">
              نعمل دوما على إيصال طلبك بأسرع وقت بالتعاون مع أفضل مزودي الخدمات اللوجستية في مصر.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-border p-5 rounded-xl bg-bg-secondary shadow-sm">
                <h3 className="font-bold text-lg mb-2">محافظة القاهرة والجيزة</h3>
                <p className="text-sm text-text-sec">يتم تجهيز وشحن الطلبات وتوصيلها للعميل خلال <strong>يومين إلى 3 أيام عمل</strong> (لا يشمل أيام الجمعة أو الإجازات الرسمية).</p>
              </div>
              <div className="border border-border p-5 rounded-xl bg-bg-secondary shadow-sm">
                <h3 className="font-bold text-lg mb-2">باقي المحافظات</h3>
                <p className="text-sm text-text-sec">تتم التغطية لكافة محافظات ومدن الجمهورية، تستغرق الشحنات للمحافظات مدة تتراوح بين <strong>3 إلى 5 أيام عمل</strong>.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">3</span>
              سياسة الإلغاء وتعديل الطلبات
            </h2>
            <p className="text-text-sec">
              بمجرد تأكيد طلبك إلكترونياً يبدأ التنفيذ الجديّ. <strong>نوفر لك إمكانية إلغاء الطلب أو تعديل تفاصيله حصرياً طالما كانت حالة الطلب (معلق أو قيد المراجعة).</strong> بمجرد تغير حالة الطلب إلى (شُحن / تم التسليم لشركة الشحن) لا يمكن إلغاؤه إطلاقاً، وتُنقل التبعات حينها لسياسة الإرجاع بعد وصوله.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">4</span>
              إخلاء المسؤولية العامة القانوني
            </h2>
            <p className="text-text-sec bg-yellow-50 p-5 rounded-xl border border-yellow-200 text-yellow-900 shadow-sm leading-loose">
              صور المنتجات المعروضة التُقطت بأعلى مقاييس الاحتراف، وتكون مشابهة لأقصى حد للواقع، ومع ذلك قد يختلف تمثيل الألوان بشكل طفيف باختلاف درجة سطوع شاشتك الشخصية. لا نتحمل أي مسؤولية عن أضرار ناتجة عن الاستخدام الخاطئ أو عدم الالتزام بتوصيات الغسيل للملابس.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
