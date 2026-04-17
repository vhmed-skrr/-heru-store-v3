import React from 'react';

export const metadata = {
  title: 'سياسة الخصوصية | Heru Store',
  description: 'سياسة الخصوصية لمتجر Heru توضح كيفية جمع واستخدام وحماية بياناتك.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm">
        <h1 className="text-3xl md:text-4xl font-black font-arabic text-text-main mb-6">سياسة الخصوصية</h1>
        <div className="text-sm text-text-sec mb-10 font-bold bg-bg-secondary inline-block px-4 py-2 rounded-lg">
          تاريخ آخر تحديث: أبريل 2026
        </div>

        <div className="space-y-10 text-text-main leading-relaxed font-medium">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-brand-50 flex items-center justify-center text-brand-600">1</span>
              كيف نجمع البيانات؟ وماهي البيانات المجمعة؟
            </h2>
            <p className="mb-3 text-text-sec">
              في متجر Heru، نؤمن بالشفافية المطلقة. نحن لا نجمع أي بيانات زائدة عن الحاجة. البيانات الوحيدة التي نطلبها ونقوم بتخزينها هي ما تقدمه أنت طواعية عند إتمامك عملية الشراء:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-main mt-4 pr-4 bg-bg-secondary p-5 rounded-xl border border-border">
              <li><strong>الاسم الكامل:</strong> لضمان وصول الشحنة للشخص الصحيح.</li>
              <li><strong>رقم الهاتف (الواتساب):</strong> للتواصل الفعال وتأكيد طلبك وتسهيل مهمة مندوب الشحن.</li>
              <li><strong>العنوان التفصيلي:</strong> لتوصيل المنتجات إلى باب منزلك بدقة داخل أنحاء جمهورية مصر العربية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-brand-50 flex items-center justify-center text-brand-600">2</span>
              كيف نستخدم بياناتك؟
            </h2>
            <p className="text-text-sec">
              يقتصر استخدامنا لبياناتك الشخصية المذكورة أعلاه حصرياً على غرض أساسي واحد، ألا وهو <strong>تنفيذ طلباتك ومعالجتها بأعلى جودة ممكنة</strong>. نحن لا نستخدم رقم هاتفك لإطارات تسويقية مزعجة بل نتواصل معك في إطار شحنتك المفتوحة لتأكيد المواعيد وتوصيل الرسائل التوضيحية اللازمة، والرد على أي الاستفسارات لديك من خلال خدمة العملاء.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-brand-50 flex items-center justify-center text-brand-600">3</span>
              عدم المشاركة مع أطراف ثالثة
            </h2>
            <p className="text-text-sec">
              بياناتك أمانة. لذلك نتعهد التزاماً صارماً بأنه <strong>لن يتم بيع، أو تأجير، أو مشاركة، أو تداول</strong> أي من معلوماتك الشخصية مع أي طرف ثالث (Third-party) لأغراض الدعاية والإعلان أو تحليل البيانات أو غيره. الطرف الوحيد الذي يطّلع على بيانات الاتصال الخاصة بك هي <i>شركة الشحن المعتمدة</i>، وفقط بالقدر اللازم لتوصيل المنتج لموقعك حصراً.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-brand-50 flex items-center justify-center text-brand-600">4</span>
              سياسة ملفات الارتباط (Cookies Tracking)
            </h2>
            <p className="text-text-sec">
              احتراماً لخصوصيتك الفائقة، <strong>منصتنا لا تستخدم أي ملفات ارتباط (Cookies) لأغراض التتبع (Tracking Cookies) أو الإعلانات الموجهة.</strong> نحن نستخدم فقط الملفات التقنية الأساسية المؤقتة والمطلوبة لضمان عمل "سلة المشتريات (Cart)" محلياً على متصفحك للحفاظ على المنتجات التي اخترت شراءها حتى مرحلة الدفع.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-brand-600 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-brand-50 flex items-center justify-center text-brand-600">5</span>
              حق المستخدم في حذف البيانات
            </h2>
            <p className="text-text-sec mb-4">
              نؤمن بحقك الكامل في السيطرة على بياناتك. في حال رغبتك في تعديل بياناتك أو مسح جميع سجلاتك وطلباتك بالكامل من قواعد بياناتنا الآمنة، يحق لك ذلك في أي وقت.
            </p>
            <div className="bg-brand-50 border border-brand-200 text-brand-800 p-5 rounded-xl flex items-center justify-between flex-wrap gap-4">
              <div>
                <strong className="block mb-1">كيف تطلب حذف بياناتك؟</strong>
                يمكنك التوجه مباشرة لخدمة الدعم الفني لتقديم طلب الحذف المباشر وسيتم الرد خلال 24 ساعة.
              </div>
              <a href="https://wa.me/201000000000" target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-5 py-2.5 rounded justify-center font-bold flex items-center gap-2 hover:bg-[#128C7E] transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                تواصل للحذف عبر الواتساب
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
