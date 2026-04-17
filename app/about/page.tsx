import React from 'react';

export const metadata = {
  title: 'عن هيرو | Heru Store',
  description: 'تعرف على قصة متجر هيرو وأهدافه ورؤيته الخاصة في عالم تصميم الأزياء الشبابية.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 w-full">
      <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-sm text-center relative overflow-hidden flex flex-col items-center">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2"></div>
        
        <h1 className="text-4xl md:text-5xl font-black font-arabic text-brand-600 tracking-tight leading-tight mb-4">Heru</h1>
        <h2 className="text-xl md:text-2xl font-bold text-text-main mb-8">صمّم بصمتك!</h2>

        <div className="w-24 h-1 bg-brand-200 rounded-full mb-10"></div>

        <div className="text-text-sec text-lg leading-relaxed space-y-6 max-w-2xl font-medium text-justify" dir="rtl">
          <p>
            بدأت قصة "<strong>هيرو Heru</strong>" من قلب شوارع القاهرة النابضة بالحياة. لم نكن نبحث فقط عن مجرد متجر تقليدي يبيع الملابس، بل كنا نبحث عن <strong>"منصة للهوية"</strong>. كل شخص يمتلك بصمةً فريدة، وكل تصميم يجب أن يروي قصة مختلفة تمثل طموحات وتمرد والتزام الشباب في هذا العصر.
          </p>
          <p>
            نحن نركز بقوة على توظيف الذوق العصري (Streetwear) مع الجودة المتميزة في التفصيل. نصنع تصاميم حصرية مبتكرة لا تجدها في المتاجر الكبرى لكي تستطيع التفرد وسط الجميع بإطلالة جريئة وعملية.
          </p>
          <p>
            رسالتنا واضحة: <strong>أنت البطل (Hero/Heru) في قصتك.</strong> ارتدِ ما يُعبر عنك، ولا تتردد أبداً في التعبير عن ذاتك، فنحن مستمرون في ابتكار الأفضل إرضاءً لشغفك في التفرد.
          </p>
        </div>

        <div className="mt-12 bg-bg-secondary w-full p-8 rounded-2xl border border-border">
          <h3 className="font-bold text-2xl mb-4 text-text-main">خلف الكواليس</h3>
          <p className="text-text-sec font-medium leading-relaxed mb-6">
            شباب مصري يعمل بشغف وطاقة متجددة لدراسة كل تفصيلة في عملية الإنتاج؛ بداية من اختيار الأقمشة الفاخرة وصولاً إلى طباعة أحدث صيحات الفن الرقمي والخطوط المعقدة التي تخطف الأنظار.
          </p>
          <a a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP || '201000000000'}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200 uppercase tracking-widest text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            تواصل معنا لتشاركنا رأيك
          </a>
        </div>
      </div>
    </div>
  );
}
