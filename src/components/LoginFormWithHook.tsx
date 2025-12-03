import useForm from '../hooks/useForm';

// הגדרת הממשק לטופס התחברות
interface LoginForm {
  email: string;
  password: string;
}

function LoginFormWithHook() {
  // ====== שימוש ב-useForm Hook ======

  // הפרמטר הראשון: ערכי התחלה
  // הפרמטר השני: כללי אימות
  const form = useForm<LoginForm>(
    // ערכי התחלה
    {
      email: '',
      password: ''
    },
    // כללי אימות
    {
      // כלל אימות לאימייל
      email: {
        validate: (email: string) => {
          // בדיקה אם השדה ריק
          if (!email) return 'אימייל חובה';

          // בדיקה עם Regex שהאימייל תקין
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return 'אימייל לא תקין';
          }

          // אין שגיאה
          return undefined;
        },
      },

      // כלל אימות לסיסמה
      password: {
        validate: (password: string) => {
          if (!password) return 'סיסמה חובה';
          if (password.length < 6) return 'לפחות 6 תווים';
          return undefined;
        },
      },
    }
  );

  // ====== פונקציה שמופעלת בשליחת טופס תקין ======
  const onSubmit = (values: LoginForm) => {
    console.log('התחברות עם:', values);

    // כאן היינו שולחים את הנתונים לשרת
    // fetch('/api/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(values)
    // });
  };

  return (
    <div className="login-container">
      <h2>התחברות</h2>

      {/* onSubmit מקבל את הפונקציה שכתבנו */}
      <form onSubmit={form.handleSubmit(onSubmit)}>

        {/* ===== שדה אימייל ===== */}
        <div className="form-field">
          <label htmlFor="email">אימייל</label>
          <input
            id="email"
            type="email"
            name="email"
            // כל ה-handlers מגיעים מה-hook!
            value={form.values.email}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            // סטייל מותנה - אם יש שגיאה והמשתמש נגע בשדה
            className={form.errors.email && form.touched.email ? 'error' : ''}
          />

          {/* הצגת שגיאה - רק אם יש שגיאה והמשתמש נגע בשדה */}
          {form.errors.email && form.touched.email && (
            <span className="error-message">{form.errors.email}</span>
          )}
        </div>

        {/* ===== שדה סיסמה ===== */}
        <div className="form-field">
          <label htmlFor="password">סיסמה</label>
          <input
            id="password"
            type="password"
            name="password"
            value={form.values.password}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            className={form.errors.password && form.touched.password ? 'error' : ''}
          />

          {form.errors.password && form.touched.password && (
            <span className="error-message">{form.errors.password}</span>
          )}
        </div>

        {/* ===== כפתורים ===== */}
        <div className="form-actions">
          <button type="submit" className="btn-primary">
            התחבר
          </button>

          {/* כפתור לאיפוס הטופס */}
          <button
            type="button"  // type="button" כדי שלא יגרום לשליחת הטופס
            onClick={form.reset}
            className="btn-secondary"
          >
            איפוס
          </button>
        </div>
      </form>

      {/* ===== הצגת המצב הנוכחי (לדיבוג) ===== */}
      <div className="debug-info">
        <h3>מצב נוכחי:</h3>
        <pre>Values: {JSON.stringify(form.values, null, 2)}</pre>
        <pre>Errors: {JSON.stringify(form.errors, null, 2)}</pre>
        <pre>Touched: {JSON.stringify(form.touched, null, 2)}</pre>
      </div>
    </div>
  );
}

export default LoginFormWithHook;
