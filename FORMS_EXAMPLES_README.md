# 📚 Forms Advanced - React Examples

פרויקט דוגמאות מקיף לטפסים מתקדמים ב-React עם הסברים מפורטים בקוד.

## 🎯 מטרת הפרויקט

פרויקט זה נבנה כחומר לימוד לשיעור "Forms Advanced" ומכיל דוגמאות מעשיות לכל הנושאים הבאים:
- ✅ Controlled Components
- ✅ Form Validation (ללא ספריות חיצוניות)
- ✅ Custom Hooks לטפסים
- ✅ File Upload + Image Preview
- ✅ Drag & Drop
- ✅ Password Strength Indicator
- ✅ Real-time Validation
- ✅ Error Handling

## 📁 מבנה הפרויקט

```
src/
├── components/
│   ├── SimpleForm.tsx              # טופס בסיסי עם Controlled Inputs
│   ├── ValidatedForm.tsx           # טופס עם אימות מלא
│   ├── LoginFormWithHook.tsx       # דוגמה לשימוש ב-useForm hook
│   ├── ImageUpload.tsx             # העלאת תמונה עם preview
│   ├── DragDropUpload.tsx          # Drag & Drop להעלאת קבצים
│   └── RegistrationForm.tsx        # טופס הרשמה מלא (משלב הכל)
├── hooks/
│   └── useForm.ts                  # Custom Hook לניהול טפסים
├── App.tsx                         # אפליקציה ראשית עם תפריט ניווט
└── main.tsx
```

## 🚀 התחלה מהירה

### התקנה

```bash
# התקנת dependencies
npm install

# הרצת שרת הפיתוח
npm run dev
```

האפליקציה תיפתח ב-`http://localhost:5173`

## 📖 רכיבי הפרויקט

### 1. SimpleForm - טופס פשוט

**קובץ:** [src/components/SimpleForm.tsx](src/components/SimpleForm.tsx)

**מה לומדים:**
- Controlled Components - איך React שולט בערכי השדות
- `useState` לניהול state של טופס
- `handleChange` אחד לכל השדות
- Computed Property Names: `[name]: value`

**דוגמה:**
```tsx
const [formData, setFormData] = useState({ email: '', password: '' });

const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

---

### 2. ValidatedForm - טופס עם אימות

**קובץ:** [src/components/ValidatedForm.tsx](src/components/ValidatedForm.tsx)

**מה לומדים:**
- פונקציות אימות (Validation Functions)
- Regular Expressions לאימות אימייל וסיסמה
- Touched state - מעקב אחרי שדות שהמשתמש נגע בהם
- Real-time validation
- Password Strength Indicator

**דוגמה:**
```tsx
const validateEmail = (email: string): string | undefined => {
  if (!email) return 'אימייל חובה';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'אימייל לא תקין';
  return undefined;
};
```

**אימות בזמן אמת:**
- `onBlur` - אימות כשעוזבים שדה
- `onChange` - אימות בזמן הקלדה (רק אם נגעו בשדה)

---

### 3. useForm Hook - Custom Hook

**קובץ:** [src/hooks/useForm.ts](src/hooks/useForm.ts)

**מה לומדים:**
- יצירת Custom Hook
- Generic Types ב-TypeScript
- Higher-Order Functions
- Reusable Logic

**שימוש:**
```tsx
const form = useForm<LoginData>(
  { email: '', password: '' },  // ערכי התחלה
  {                              // כללי אימות
    email: {
      validate: (v) => !v ? 'חובה' : undefined
    }
  }
);

<form onSubmit={form.handleSubmit(onSubmit)}>
  <input
    name="email"
    value={form.values.email}
    onChange={form.handleChange}
    onBlur={form.handleBlur}
  />
  {form.errors.email && <span>{form.errors.email}</span>}
</form>
```

**דוגמה לשימוש:** [src/components/LoginFormWithHook.tsx](src/components/LoginFormWithHook.tsx)

---

### 4. ImageUpload - העלאת תמונה

**קובץ:** [src/components/ImageUpload.tsx](src/components/ImageUpload.tsx)

**מה לומדים:**
- `input[type="file"]`
- FileReader API
- Preview של תמונות
- אימות קבצים (סוג, גודל)
- FormData לשליחת קבצים

**תהליך העלאה:**
```tsx
const handleFileChange = (e) => {
  const file = e.target.files?.[0];

  // בדיקות תקינות
  if (!file.type.startsWith('image/')) return;
  if (file.size > 5 * 1024 * 1024) return;  // max 5MB

  // יצירת preview
  const reader = new FileReader();
  reader.onloadend = () => {
    setPreview(reader.result as string);
  };
  reader.readAsDataURL(file);
};
```

**שליחה לשרת:**
```tsx
const formData = new FormData();
formData.append('image', file);

await fetch('/api/upload', {
  method: 'POST',
  body: formData
});
```

---

### 5. DragDropUpload - Drag & Drop

**קובץ:** [src/components/DragDropUpload.tsx](src/components/DragDropUpload.tsx)

**מה לומדים:**
- Drag & Drop Events
- `onDragOver`, `onDragLeave`, `onDrop`
- `e.preventDefault()` - למניעת פתיחת הקובץ
- `e.dataTransfer.files` - קבלת הקבצים

**מימוש:**
```tsx
const handleDragOver = (e) => {
  e.preventDefault();  // חובה!
  setIsDragging(true);
};

const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  // ... עיבוד הקובץ
};
```

---

### 6. RegistrationForm - טופס הרשמה מלא

**קובץ:** [src/components/RegistrationForm.tsx](src/components/RegistrationForm.tsx)

**משלב את כל הטכניקות:**
- ✅ useForm hook
- ✅ Validation מתקדם (שם, אימייל, סיסמה, טלפון)
- ✅ Password confirmation
- ✅ Password strength indicator
- ✅ תמונת פרופיל
- ✅ Checkbox לתנאי שימוש
- ✅ Loading states
- ✅ Success messages

**אימות מתקדם:**
```tsx
phone: {
  validate: (phone) => {
    const clean = phone.replace(/[-\s]/g, '');
    if (!/^\d+$/.test(clean)) return 'רק ספרות';
    if (clean.length !== 10) return '10 ספרות';
    if (!clean.startsWith('05')) return 'חייב להתחיל ב-05';
    return undefined;
  }
}
```

---

## 🎨 עיצוב ו-UX

הפרויקט כולל:
- 🎨 Inline CSS עם styled components
- 🌈 Gradient backgrounds
- ✨ Animations (fadeIn, pulse)
- 📱 Responsive design
- 🎯 Visual feedback (hover, focus, error states)
- 🔴 Error states עם צבעים אדומים
- 🟢 Success states עם צבעים ירוקים

## 📝 קונספטים חשובים

### Controlled vs Uncontrolled

**Controlled (מומלץ ב-React):**
```tsx
<input
  value={state}
  onChange={(e) => setState(e.target.value)}
/>
```

**Uncontrolled (לא מומלץ):**
```tsx
const inputRef = useRef();
<input ref={inputRef} />
// גישה: inputRef.current.value
```

### Validation Patterns

**דפוסי אימות נפוצים:**

```tsx
// אימייל
/^[^\s@]+@[^\s@]+\.[^\s@]+$/

// סיסמה חזקה
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// טלפון ישראלי
/^05\d{8}$/

// שם (אותיות בלבד)
/^[a-zA-Zא-ת\s]+$/
```

### Touched State Pattern

למה צריך `touched`?
```tsx
// רע - מציג שגיאות מיד
{errors.email && <span>{errors.email}</span>}

// טוב - מציג שגיאות רק אחרי שנגעו בשדה
{errors.email && touched.email && <span>{errors.email}</span>}
```

### Form Submit Pattern

```tsx
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();  // חובה! מונע רענון דף

  const errors = validate();
  setErrors(errors);

  if (Object.values(errors).some(e => e)) {
    return;  // יש שגיאות
  }

  // הטופס תקין - שלח לשרת
  submitToAPI(formData);
};
```

## 🔧 טכנולוגיות

- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 CSS-in-JS (inline styles)

## 📚 למידה נוספת

### סדר מומלץ ללימוד:

1. **התחל עם SimpleForm** - הבן Controlled Components
2. **עבור ל-ValidatedForm** - למד Validation Patterns
3. **צלול ל-useForm Hook** - הבן Custom Hooks
4. **נסה ImageUpload** - למד File Handling
5. **התנסה ב-DragDropUpload** - למד Drag & Drop API
6. **לבסוף RegistrationForm** - ראה הכל ביחד

### טיפים ללמידה:

- 📖 **קרא את ההערות בקוד** - כל שורה מוסברת!
- 🔍 **פתח Developer Console** - ראה מה נשלח
- ✏️ **נסה לשנות** - התנסה בקוד
- 🐛 **שבור דברים** - למד מטעויות
- 🔄 **בנה מחדש** - נסה לכתוב בעצמך

## 🎯 תרגילים מוצעים

### תרגיל 1: ContactForm
צור טופס יצירת קשר עם:
- שם, אימייל, טלפון, הודעה
- אימות לכל שדה
- הודעה: מינימום 10 תווים

### תרגיל 2: Password Confirmation
הוסף ל-RegistrationForm:
- שדה "אישור סיסמה"
- בדיקה שהסיסמאות תואמות
- הצגת שגיאה אם לא תואמות

### תרגיל 3: Multi-File Upload
שפר את ImageUpload:
- אפשר העלאת מספר תמונות
- הצג preview לכולן
- אפשר מחיקת תמונות בודדות

### תרגיל 4: Progress Bar
הוסף Progress Bar להעלאת קבצים:
- השתמש ב-XMLHttpRequest
- עקוב אחרי progress event
- הצג אחוזים

## 🐛 Debugging Tips

### שגיאה: "Cannot read property 'value' of undefined"
```tsx
// בעיה: name לא מוגדר
<input onChange={handleChange} />

// פתרון: הוסף name
<input name="email" onChange={handleChange} />
```

### שגיאה: "Maximum update depth exceeded"
```tsx
// בעיה: קורא לפונקציה במקום להעביר reference
<form onSubmit={handleSubmit()}>

// פתרון: העבר reference
<form onSubmit={handleSubmit}>
```

### אימות לא עובד
```tsx
// בדוק:
1. האם name בinput תואם למפתח ב-formData?
2. האם קוראים ל-preventDefault?
3. האם touched מוגדר נכון?
4. פתח Console - בדוק errors state
```

## 💡 Best Practices

1. **תמיד השתמש ב-Controlled Components** ב-React
2. **אמת בצד לקוח ובצד שרת** (client + server)
3. **אל תאמן בHTML5 validation בלבד** - קל לעקוף
4. **הצג שגיאות רק אחרי touch/blur** - UX טוב יותר
5. **נקה שגיאות כשהמשתמש מתקן** - Real-time feedback
6. **Disable כפתור submit בזמן שליחה** - מונע double submit
7. **תמיד בדוק סוג וגודל קובץ** לפני העלאה
8. **השתמש ב-FormData** לשליחת קבצים
9. **הוסף loading states** לאינדיקציה למשתמש
10. **נסה ב-TypeScript** - מונע באגים רבים

## 🔐 Security Notes

⚠️ **חשוב:**
- אימות בצד לקוח הוא ל-UX בלבד
- תמיד אמת בצד שרת!
- אל תשלח סיסמאות ב-URL או query params
- השתמש ב-HTTPS בפרודקשן
- הצפן סיסמאות בשרת (bcrypt, argon2)
- בדוק קבצים בשרת (סוג, גודל, תוכן)

## 📞 תמיכה

יש שאלות? בעיות? הצעות?
- 📧 פתח issue
- 💬 שאל בשיעור
- 📖 קרא את ההערות בקוד

---

**נבנה עם ❤️ למטרות לימוד**

Good luck! 🚀
