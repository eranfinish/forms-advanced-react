import { useState, type FormEvent } from 'react';

// ממשק לנתוני הטופס
interface FormData {
  email: string;
  password: string;
  name: string;
}

// ממשק לשגיאות - כל שדה יכול להיות undefined (אין שגיאה) או string (יש שגיאה)
interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
}

function ValidatedForm() {
  // מצב הטופס - הנתונים עצמם
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });

  // מצב השגיאות - כל שדה יכול להכיל הודעת שגיאה או להיות ריק
  const [errors, setErrors] = useState<FormErrors>({});

  // מעקב אחרי שדות שהמשתמש נגע בהם (touched)
  // נציג שגיאות רק לשדות שהמשתמש כבר ניסה למלא
  // זה משפר את חוויית המשתמש - לא להציג שגיאות מיד כשהדף נטען
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // ====== פונקציות אימות (Validation) ======

  // אימות אימייל
  const validateEmail = (email: string): string | undefined => {
    // בדיקה ראשונה - האם השדה ריק?
    if (!email) return 'אימייל חובה';

    // Regex (Regular Expression) לבדיקת פורמט אימייל תקין
    // ^[^\s@]+ - מתחיל בתווים שאינם רווח או @
    // @ - חייב להכיל @
    // [^\s@]+ - אחרי ה-@ תווים שאינם רווח או @
    // \. - חייב להכיל נקודה
    // [^\s@]+$ - מסתיים בתווים שאינם רווח או @
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'אימייל לא תקין';

    // אם עבר את כל הבדיקות - אין שגיאה
    return undefined;
  };

  // אימות סיסמה
  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'סיסמה חובה';

    // בדיקת אורך מינימלי
    if (password.length < 6) return 'לפחות 6 תווים';

    // בדיקה שיש אות גדולה (A-Z)
    if (!/[A-Z]/.test(password)) return 'חייב אות גדולה';

    // בדיקה שיש ספרה (0-9)
    if (!/[0-9]/.test(password)) return 'חייב מספר';

    return undefined;
  };

  // אימות שם
  const validateName = (name: string): string | undefined => {
    if (!name) return 'שם חובה';
    if (name.length < 2) return 'לפחות 2 תווים';
    return undefined;
  };

  // פונקציה שמאמתת את כל השדות בבת אחת
  const validate = (): FormErrors => {
    return {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      name: validateName(formData.name),
    };
  };

  // ====== מטפלי אירועים (Event Handlers) ======

  // מטפל בשינוי ערך בשדה
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // עדכון הערך
    setFormData(prev => ({ ...prev, [name]: value }));

    // אימות בזמן אמת - רק אחרי שהמשתמש נגע בשדה
    // זה נותן feedback מיידי אבל לא מציק מדי
    if (touched[name]) {
      const newErrors = { ...errors };

      // מריצים את פונקציית האימות המתאימה לפי שם השדה
      if (name === 'email') newErrors.email = validateEmail(value);
      if (name === 'password') newErrors.password = validatePassword(value);
      if (name === 'name') newErrors.name = validateName(value);

      setErrors(newErrors);
    }
  };

  // מטפל באירוע onBlur - כשהמשתמש עוזב את השדה
  // זה קורה כשלוחצים על שדה אחר או Tab
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;

    // מסמן שנגענו בשדה הזה
    setTouched(prev => ({ ...prev, [name]: true }));

    // מריץ אימות על השדה
    const newErrors = { ...errors };
    if (name === 'email') newErrors.email = validateEmail(formData.email);
    if (name === 'password') newErrors.password = validatePassword(formData.password);
    if (name === 'name') newErrors.name = validateName(formData.name);
    setErrors(newErrors);
  };

  // מטפל בשליחת הטופס
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // אימות מלא של כל השדות
    const validationErrors = validate();
    setErrors(validationErrors);

    // בדיקה אם יש שגיאות
    // Object.values מחזיר מערך של כל הערכים
    // some בודק אם יש לפחות ערך אחד שעונה על התנאי
    const hasErrors = Object.values(validationErrors).some(error => error);

    if (!hasErrors) {
      // הטופס תקין - אפשר לשלוח לשרת
      console.log('✅ טופס תקין!', formData);
      // כאן היינו שולחים ל-API:
      // await fetch('/api/register', { method: 'POST', body: JSON.stringify(formData) })
    } else {
      console.log('❌ יש שגיאות!', validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {/* ===== שדה שם ===== */}
      <div className="form-field">
        <label>שם מלא</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}  // מופעל כשעוזבים את השדה
          // מוסיף class של error אם יש שגיאה והמשתמש נגע בשדה
          className={errors.name && touched.name ? 'error' : ''}
        />
        {/* מציג הודעת שגיאה רק אם יש שגיאה והמשתמש נגע בשדה */}
        {errors.name && touched.name && (
          <span className="error-message">{errors.name}</span>
        )}
      </div>

      {/* ===== שדה אימייל ===== */}
      <div className="form-field">
        <label>אימייל</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.email && touched.email ? 'error' : ''}
        />
        {errors.email && touched.email && (
          <span className="error-message">{errors.email}</span>
        )}
      </div>

      {/* ===== שדה סיסמה ===== */}
      <div className="form-field">
        <label>סיסמה</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className={errors.password && touched.password ? 'error' : ''}
        />
        {errors.password && touched.password && (
          <span className="error-message">{errors.password}</span>
        )}

        {/* אינדיקטור חוזק סיסמה - מוצג רק אם יש משהו בשדה */}
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              {/* חישוב רמת חוזק הסיסמה */}
              <div
                className={`bar ${
                  // סיסמה חזקה: 8+ תווים, אות גדולה, מספר
                  formData.password.length >= 8 &&
                  /[A-Z]/.test(formData.password) &&
                  /[0-9]/.test(formData.password)
                    ? 'strong'
                    // סיסמה בינונית: 6+ תווים
                    : formData.password.length >= 6
                    ? 'medium'
                    // סיסמה חלשה
                    : 'weak'
                }`}
              />
            </div>
          </div>
        )}
      </div>

      <button type="submit">שלח</button>
    </form>
  );
}

export default ValidatedForm;
