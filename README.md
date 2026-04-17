# Heru Store v3 🛒
**[ 🌍 English & 🇸🇦 عربي ]**

---

## 🌟 English

### 🚀 Quick Start (5 minutes)
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/heru-store-v3.git
   cd heru-store-v3
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Setup environment variables:**
   Copy `.env.example` to `.env.local` and fill in the required keys. (See table below)
4. **Supabase Setup:**
   Run the initial SQL schemas, create the admin user, and initialize storage buckets using the scripts available in the `supabase/` folder.
5. **Run the development server:**
   ```bash
   npm run dev
   ```

### 🗝️ Environment Variables
| Variable | Required | Description |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (NEVER expose to client/git) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | Store WhatsApp number (without '+', e.g., `201124519232`) |
| `RESEND_API_KEY` | ❌ | Resend API key for Email notifications |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ | Sentry DSN for Error tracking |
| `NEXT_PUBLIC_ENABLE_COUPONS` | ❌ | Enable/Disable coupons (default: true) |

### 🗄️ Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Navigate to the SQL Editor and run the core SQL scripts provided (`supabase/schema.sql`).
3. Set up Storage buckets by running `supabase/storage-setup.sql`:
   - It will establish `product-images` and `category-images` buckets with public access and authenticated-write RLS policies.
4. Establish an Admin Authentication user to manage your back-office systems via the Supabase dashboard.

### 🏗️ Project Structure
```text
heru-store-v3/
├── app/                  # Next.js App Router root (Pages, Layouts, API routes)
│   ├── (store)/          # Public storefront views (Shop, Checkout)
│   └── admin/            # Secure admin dashboard route groups
├── components/           # Reusable React components
│   ├── ui/               # Minimal, styled UI elements (Buttons, Inputs)
│   ├── product/          # Product specific fragments (Gallery, Card)
│   └── admin/            # Administration dashboards elements
├── lib/                  # Utilities, actions, and third-party setups
├── public/               # Static icons and assets
└── supabase/             # SQL initialization scripts and RLS verification
```

### 🚀 Deployment (Vercel)
1. Push your up-to-date repository to a GitHub account.
2. Sign in to your Vercel dashboard and import the project.
3. Inside deployment settings, securely load the `Environment Variables` matching what you populated into `.env.local`.
4. Deploy the application.

### 📈 Upgrade Triggers
Monitor your traffic to determine when infrastructure updates are sensible:
- **Supabase Pro:** Consider upgrading to the $25/mo plan once your database size bypasses 500MB or your site retains > 50,000 monthly active users.
- **Vercel Pro:** Consider upgrading to the $20/mo plan typically when your public bandwidth approaches the 100GB threshold.

### 🛑 Anti-Patterns (What NOT to do)
- ❌ **NEVER** hard-code sensitive credentials/API keys into `.ts` or `.tsx` files.
- ❌ **DO NOT** utilize external hosting/CDNs like Cloudinary. The codebase was natively constructed strictly around Supabase native Storage.
- ❌ **NEVER** append `NEXT_PUBLIC_` to the `SUPABASE_SERVICE_ROLE_KEY`. This compromises the entirety of your backend logic.

---

<br />

## 🌟 الشرح باللغة العربية (Arabic)

### 🚀 بدء العمل السريع (في 5 دقائق)
1. **استنساخ المستودع عبر Git:**
   ```bash
   git clone https://github.com/your-username/heru-store-v3.git
   cd heru-store-v3
   ```
2. **تثبيت حزم الاعتمادية:**
   ```bash
   npm install
   ```
3. **تهيئة متغيرات البيئة:**
   اصنع نسخة من ملف المتغيرات `.env.example` وأعد تسميتها لتصبح `.env.local` وأدخل المفاتيح المطلوبة داخلها.
4. **تجهيز قاعدة بيانات Supabase:**
   قم بتنفيذ الأوامر (SQL Queries) لإنشاء الجداول وحاويات التخزين، وأضف حساب الأدمن لتجهيز لوحة التحكم.
5. **تشغيل خادم التطوير محلياً:**
   ```bash
   npm run dev
   ```

### 🗝️ متغيرات البيئة الأساسية
| المتغير | الإلزام | الوصف |
|----------|:--------:|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | الرابط الأساسي الخاص بالخادم على Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | المفتاح العام المصرّح للزوار بالتفاعل عبره |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | مفتاح الإدارة وصلاحيات الخدمة كاملة (يجب أن لا يُرفع لكتلة الأكواد المفتوحة Git) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | ✅ | رقم واتساب مبيعات متجرك (بدون `+` مثل: 201124519232) |
| `RESEND_API_KEY` | ❌ | واجهة برمجيات Resend للإيميلات والإشعارات (اختياري) |
| `NEXT_PUBLIC_GA_ID` | ❌ | مُعرّف تتبع Google Analytics 4 (اختياري) |
| `NEXT_PUBLIC_SENTRY_DSN` | ❌ | مفتاح واجهة Sentry لتعقب السقوط والأخطاء (اختياري) |
| `NEXT_PUBLIC_ENABLE_COUPONS` | ❌ | تفعيل/إيقاف خصائص الكوبونات (افتراضياً: true) |

### 🗄️ إعدادات وبيئة Supabase
1. توجه لمنصة [Supabase](https://supabase.com) واصنع مشروعاً جديداً.
2. قم بتنصيب الجسد الهندسي للجداول (Tables Schema) عبر فتح محرر الـ SQL بـ Supabase ووضع الأكواد الموجودة في `supabase/schema.sql`.
3. قم بإنشاء الحاويات السحابية `Storage buckets` عبر وضع الأكواد الموجودة في ملف `supabase/storage-setup.sql` لتقييد وتحديد أوزان الملفات المرفوعة لمسارات المتجر بـ (صندوق لصور المنتجات، وصندوق لصور الأقسام).
4. استخدم قسم الـ (Authentication) لتعيين مستخدمك الرئيسي وتحديد حسابه كمدير (Admin) لتسجيل الدخول للوحة التحكم والمخزون لاحقا.

### 🏗️ بنية المشروع المعمارية
```text
heru-store-v3/
├── app/                  # واجهة النظام وراوتر العمل لـ Next.js ويحتوي المسارات الرئيسية والجانبية
│   ├── (store)/          # المسارات العامة (Shop, مقالة المنتج, عربة التسوق)
│   └── admin/            # نظام لوحة التحكم المتطور الخاص بالإدارة المحمية
├── components/           # مركبات هندسة واجهة المستخدم (UI) واللتي تستخدم طوال المشروع 
│   ├── ui/               # مكونات عامة ومجردة (أزرة تفاعلية، نصوص منسقة)
│   ├── product/          # حزم المكونات المعنية بتفاصيل المنتجات وكروتها 
│   └── admin/            # المكونات المصممة للوحة التحكم والموظفين فقط
├── lib/                  # مكاتب الربط، التحليلات، ودوال التأكيد ومعالجات Supabase و Sentry
├── public/               # تخزين لخطوط النظام والصور الرمزية الثابتة 
└── supabase/             # إعدادات، مخططات الـ SQL، الجداول وصلاحيات مستوى البيانات (RLS)
```

### 🚀 الرفع والنشر العام (عبر Vercel)
1. قُم بدفع ورفع ملفات المشروع الخاصة بك لحسابك على موقع GitHub.
2. اتصل مع GitHub عبر واجهة Vercel واسحب المشروع.
3. ادخل لمنطقة الإعدادت في المشروع وضع المتغيرات البيئية `Environment Variables` التي أضفتها في `.env.local`.
4. ابدأ الاستنساخ (Deploy)!

### 📈 متى ينبغي لك الترقية؟ 
متى يجب دفع اشتراك للخدمات السحابية كـ Supabase أو Vercel بدلاً من الاستمرار بالنسخ المجانية؟
- **ترقية Supabase Pro:** عندما ترتفع بيانات المتجر وتتخطى سعة قواعد البيانات 500 ميجا-بايت، أو حال وصل زوارك المتفاعلين النشطين حاجز 50 ألف زائر بنهاية الشهر.
- **ترقية Vercel Pro:** عندما يقترب نطاق تصفح عملائك من كميات تنزيل بيانات (Bandwidth) توازي 100 جيجا-بايت.

### 🛑 الممارسات الممنوعة جذرياً (Anti-Patterns)
- ❌ **إياك** أن تضع أرقام المتاجر السرية، كلمات المرور أو مُعرّفات مفاتيح الـ API نصاً صريحاً في ملفات الكود الأساسية `.ts` لأنها ستكُشف أمام الزوّار.
- ❌ **لا تستخدم** Cloudinary أو خدمات تخزين الصور الخارجيّة، تم توظيف بنية متجر هيرو بالكامل لدعم حاويات تخزين `Supabase Storage` بشكل محكم وآمن داخلياً.
- ❌ **مُحرم تقنياً** وضع الإضافة `NEXT_PUBLIC_` بجوار مفتاح الـ `SUPABASE_SERVICE_ROLE_KEY`، إذ تمنح هذا المفتاح صلاحيات جذرية كاملة لتغيير قواعد بيانات النظام وإذا انكشف على واجهة المستخدمين فسينهار جدار المتجر الأمني فوراً.
