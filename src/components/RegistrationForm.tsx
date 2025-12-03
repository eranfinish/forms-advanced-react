import { useState } from 'react';
import useForm from '../hooks/useForm';

// ====== Type Definitions ======

// נתוני הטופס
interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  agreeToTerms: boolean;
}

/**
 * טופס הרשמה מלא
 * משלב:
 * - useForm hook לניהול הטופס
 * - Validation מתקדם
 * - File upload לתמונת פרופיל
 * - Password strength indicator
 * - אישור תנאי שימוש
 */
function RegistrationForm() {
  // ====== State Management ======

  // תמונת פרופיל
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  // האם הטופס נשלח?
  const [isSubmitting, setIsSubmitting] = useState(false);

  // האם ההרשמה הצליחה?
  const [successMessage, setSuccessMessage] = useState('');

  // ====== Form Hook with Validation ======

  const form = useForm<RegistrationData>(
    // ערכי התחלה
    {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      agreeToTerms: false,
    },
    // כללי אימות
    {
      // אימות שם
      name: {
        validate: (name: string) => {
          if (!name.trim()) return 'שם מלא הוא שדה חובה';
          if (name.trim().length < 2) return 'השם חייב להכיל לפחות 2 תווים';
          if (name.trim().length > 50) return 'השם ארוך מדי (מקסימום 50 תווים)';
          // בדיקה שיש לפחות שם ושם משפחה
          if (!name.includes(' ')) return 'נא להזין שם ושם משפחה';
          return undefined;
        },
      },

      // אימות אימייל
      email: {
        validate: (email: string) => {
          if (!email) return 'אימייל הוא שדה חובה';

          // Regex מורכב יותר לאימייל
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(email)) return 'אימייל לא תקין';

          return undefined;
        },
      },

      // אימות סיסמה
      password: {
        validate: (password: string) => {
          if (!password) return 'סיסמה היא שדה חובה';
          if (password.length < 8) return 'הסיסמה חייבת להכיל לפחות 8 תווים';
          if (!/[A-Z]/.test(password)) return 'הסיסמה חייבת להכיל לפחות אות גדולה אחת';
          if (!/[a-z]/.test(password)) return 'הסיסמה חייבת להכיל לפחות אות קטנה אחת';
          if (!/[0-9]/.test(password)) return 'הסיסמה חייבת להכיל לפחות ספרה אחת';
          if (!/[!@#$%^&*]/.test(password)) return 'הסיסמה חייבת להכיל תו מיוחד (!@#$%^&*)';
          return undefined;
        },
      },

      // אימות אישור סיסמה
      confirmPassword: {
        validate: (confirmPassword: string) => {
          if (!confirmPassword) return 'נא לאשר את הסיסמה';
          // השוואה לסיסמה המקורית
          if (confirmPassword !== form.values.password) {
            return 'הסיסמאות אינן תואמות';
          }
          return undefined;
        },
      },

      // אימות טלפון
      phone: {
        validate: (phone: string) => {
          if (!phone) return 'מספר טלפון הוא שדה חובה';

          // מסיר מקפים ורווחים
          const cleanPhone = phone.replace(/[-\s]/g, '');

          // בדיקה שיש רק ספרות
          if (!/^\d+$/.test(cleanPhone)) return 'מספר טלפון יכול להכיל רק ספרות';

          // בדיקת אורך (10 ספרות בישראל)
          if (cleanPhone.length !== 10) return 'מספר טלפון חייב להכיל 10 ספרות';

          // בדיקה שמתחיל ב-05
          if (!cleanPhone.startsWith('05')) return 'מספר טלפון חייב להתחיל ב-05';

          return undefined;
        },
      },

      // אימות תנאי שימוש
      agreeToTerms: {
        validate: (agreed: boolean) => {
          if (!agreed) return 'יש לאשר את תנאי השימוש';
          return undefined;
        },
      },
    }
  );

  // ====== Password Strength Calculator ======

  /**
   * מחשב את חוזק הסיסמה
   * @returns 'weak' | 'medium' | 'strong'
   */
  const getPasswordStrength = (): 'weak' | 'medium' | 'strong' => {
    const password = form.values.password;
    if (!password) return 'weak';

    let strength = 0;

    // קריטריונים לחוזק:
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  // ====== Image Upload Handlers ======

  /**
   * טיפול בבחירת תמונת פרופיל
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // בדיקת תקינות
      if (!file.type.startsWith('image/')) {
        alert('נא לבחור קובץ תמונה');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('התמונה גדולה מדי! מקסימום 2MB');
        return;
      }

      // שמירת הקובץ
      setProfileImage(file);

      // יצירת preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * הסרת תמונה
   */
  const removeImage = () => {
    setProfileImage(null);
    setImagePreview('');
  };

  // ====== Form Submit Handler ======

  /**
   * שליחת הטופס
   */
  const handleSubmit = async (values: RegistrationData) => {
    // סימון שהטופס בתהליך שליחה
    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // ====== הכנת הנתונים לשליחה ======

      // יצירת FormData כדי לשלוח גם קבצים
      const formData = new FormData();

      // הוספת כל השדות
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('phone', values.phone);

      // הוספת תמונה אם קיימת
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      // ====== שליחה לשרת ======

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formData,
        // לא מוסיפים Content-Type - הדפדפן יוסיף אוטומטית עם boundary
      });

      if (response.ok) {
        const data = await response.json();
        console.log('הרשמה הצליחה!', data);

        // הצגת הודעת הצלחה
        setSuccessMessage('ההרשמה הצליחה! מיד תועבר לדף הבית...');

        // איפוס הטופס
        form.reset();
        removeImage();

        // דוגמה: העברה לדף אחר אחרי 2 שניות
        // setTimeout(() => {
        //   window.location.href = '/dashboard';
        // }, 2000);

      } else {
        // טיפול בשגיאות שרת
        const errorData = await response.json();
        alert(`שגיאה: ${errorData.message || 'אירעה שגיאה'}`);
      }

    } catch (error) {
      console.error('שגיאה בהרשמה:', error);
      alert('אירעה שגיאה בהרשמה. נא לנסות שוב.');

    } finally {
      // סיום תהליך השליחה
      setIsSubmitting(false);
    }
  };

  // ====== Render ======

  const passwordStrength = getPasswordStrength();

  return (
    <div className="registration-container">
      <h1>הרשמה למערכת</h1>

      {/* הודעת הצלחה */}
      {successMessage && (
        <div className="success-message">
          ✅ {successMessage}
        </div>
      )}

      <form onSubmit={form.handleSubmit(handleSubmit)} className="registration-form">

        {/* ===== תמונת פרופיל ===== */}
        <div className="form-section">
          <h3>תמונת פרופיל (אופציונלי)</h3>

          <div className="image-upload-area">
            {imagePreview ? (
              // תצוגת התמונה
              <div className="image-preview">
                <img src={imagePreview} alt="Profile" />
                <button type="button" onClick={removeImage} className="remove-image">
                  ❌ הסר תמונה
                </button>
              </div>
            ) : (
              // כפתור העלאה
              <label htmlFor="profile-image" className="upload-label">
                📷 בחר תמונת פרופיל
              </label>
            )}

            <input
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        {/* ===== פרטים אישיים ===== */}
        <div className="form-section">
          <h3>פרטים אישיים</h3>

          {/* שם מלא */}
          <div className="form-field">
            <label htmlFor="name">שם מלא *</label>
            <input
              id="name"
              type="text"
              name="name"
              value={form.values.name}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={form.errors.name && form.touched.name ? 'error' : ''}
              placeholder="לדוגמה: יוסי כהן"
            />
            {form.errors.name && form.touched.name && (
              <span className="error-message">{form.errors.name}</span>
            )}
          </div>

          {/* אימייל */}
          <div className="form-field">
            <label htmlFor="email">אימייל *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.values.email}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={form.errors.email && form.touched.email ? 'error' : ''}
              placeholder="example@email.com"
            />
            {form.errors.email && form.touched.email && (
              <span className="error-message">{form.errors.email}</span>
            )}
          </div>

          {/* טלפון */}
          <div className="form-field">
            <label htmlFor="phone">מספר טלפון *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.values.phone}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={form.errors.phone && form.touched.phone ? 'error' : ''}
              placeholder="050-1234567"
            />
            {form.errors.phone && form.touched.phone && (
              <span className="error-message">{form.errors.phone}</span>
            )}
          </div>
        </div>

        {/* ===== סיסמה ===== */}
        <div className="form-section">
          <h3>הגדרת סיסמה</h3>

          {/* סיסמה */}
          <div className="form-field">
            <label htmlFor="password">סיסמה *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.values.password}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={form.errors.password && form.touched.password ? 'error' : ''}
              placeholder="לפחות 8 תווים"
            />
            {form.errors.password && form.touched.password && (
              <span className="error-message">{form.errors.password}</span>
            )}

            {/* אינדיקטור חוזק סיסמה */}
            {form.values.password && (
              <div className="password-strength-container">
                <div className={`password-strength-bar ${passwordStrength}`}>
                  <div className="bar-fill"></div>
                </div>
                <span className="strength-text">
                  {passwordStrength === 'weak' && '⚠️ חלשה'}
                  {passwordStrength === 'medium' && '🔶 בינונית'}
                  {passwordStrength === 'strong' && '✅ חזקה'}
                </span>
              </div>
            )}
          </div>

          {/* אישור סיסמה */}
          <div className="form-field">
            <label htmlFor="confirmPassword">אישור סיסמה *</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={form.values.confirmPassword}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              className={form.errors.confirmPassword && form.touched.confirmPassword ? 'error' : ''}
              placeholder="הזן את הסיסמה שוב"
            />
            {form.errors.confirmPassword && form.touched.confirmPassword && (
              <span className="error-message">{form.errors.confirmPassword}</span>
            )}
          </div>
        </div>

        {/* ===== תנאי שימוש ===== */}
        <div className="form-section">
          <div className="form-field checkbox-field">
            <label htmlFor="agreeToTerms" className="checkbox-label">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                checked={form.values.agreeToTerms}
                onChange={(e) => {
                  // checkbox משתמש ב-checked ולא ב-value
                  form.handleChange({
                    target: {
                      name: 'agreeToTerms',
                      value: e.target.checked,
                    },
                  } as any);
                }}
                onBlur={form.handleBlur}
              />
              <span>
                אני מאשר/ת את{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  תנאי השימוש
                </a>
                {' '}ו
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  מדיניות הפרטיות
                </a>
                {' *'}
              </span>
            </label>
            {form.errors.agreeToTerms && form.touched.agreeToTerms && (
              <span className="error-message">{form.errors.agreeToTerms}</span>
            )}
          </div>
        </div>

        {/* ===== כפתור שליחה ===== */}
        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}  // השבתת הכפתור בזמן שליחה
          >
            {isSubmitting ? '⏳ שולח...' : '✅ הירשם'}
          </button>

          <button
            type="button"
            onClick={() => {
              form.reset();
              removeImage();
            }}
            className="reset-button"
            disabled={isSubmitting}
          >
            🔄 איפוס
          </button>
        </div>

        {/* ===== הערה ===== */}
        <p className="required-note">* שדות חובה</p>
      </form>

      {/* ===== CSS Styles ===== */}
      <style>{`
        .registration-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .registration-container h1 {
          text-align: center;
          color: #333;
          margin-bottom: 2rem;
        }

        .success-message {
          background: #d4edda;
          color: #155724;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          border: 1px solid #e0e0e0;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .form-section h3 {
          margin: 0 0 1rem 0;
          color: #555;
          font-size: 1.1rem;
        }

        .form-field {
          margin-bottom: 1.5rem;
        }

        .form-field:last-child {
          margin-bottom: 0;
        }

        .form-field label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 500;
        }

        .form-field input[type="text"],
        .form-field input[type="email"],
        .form-field input[type="tel"],
        .form-field input[type="password"] {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
          box-sizing: border-box;
        }

        .form-field input:focus {
          outline: none;
          border-color: #4CAF50;
        }

        .form-field input.error {
          border-color: #f44336;
        }

        .error-message {
          display: block;
          color: #f44336;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .image-upload-area {
          text-align: center;
        }

        .upload-label {
          display: inline-block;
          padding: 1rem 2rem;
          background: #4CAF50;
          color: white;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .upload-label:hover {
          background: #45a049;
        }

        .image-preview {
          position: relative;
          display: inline-block;
        }

        .image-preview img {
          width: 150px;
          height: 150px;
          object-fit: cover;
          border-radius: 50%;
          border: 3px solid #4CAF50;
        }

        .remove-image {
          margin-top: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .password-strength-container {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .password-strength-bar {
          flex: 1;
          height: 6px;
          background: #e0e0e0;
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.3s, background 0.3s;
        }

        .password-strength-bar.weak .bar-fill {
          width: 33%;
          background: #f44336;
        }

        .password-strength-bar.medium .bar-fill {
          width: 66%;
          background: #ff9800;
        }

        .password-strength-bar.strong .bar-fill {
          width: 100%;
          background: #4CAF50;
        }

        .strength-text {
          font-size: 0.875rem;
          white-space: nowrap;
        }

        .checkbox-field {
          margin-bottom: 0;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          margin-top: 0.25rem;
          cursor: pointer;
        }

        .checkbox-label a {
          color: #4CAF50;
          text-decoration: none;
        }

        .checkbox-label a:hover {
          text-decoration: underline;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .submit-button,
        .reset-button {
          flex: 1;
          padding: 1rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .submit-button {
          background: #4CAF50;
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .submit-button:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .reset-button {
          background: #f5f5f5;
          color: #333;
        }

        .reset-button:hover:not(:disabled) {
          background: #e0e0e0;
        }

        .required-note {
          text-align: center;
          color: #666;
          font-size: 0.875rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
}

export default RegistrationForm;
