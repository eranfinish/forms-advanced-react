import { useState } from 'react';
import './App.css';

// ייבוא כל הקומפוננטות שיצרנו
import SimpleForm from './components/SimpleForm';
import ValidatedForm from './components/ValidatedForm';
import LoginFormWithHook from './components/LoginFormWithHook';
import ImageUpload from './components/ImageUpload';
import DragDropUpload from './components/DragDropUpload';
import RegistrationForm from './components/RegistrationForm';

/**
 * האפליקציה הראשית
 * מציגה תפריט לבחירת דוגמאות שונות של טפסים
 */
function App() {
  // ניהול מצב - איזו דוגמה להציג
  const [activeDemo, setActiveDemo] = useState<string>('registration');

  // ====== פונקציית עזר להצגת הדוגמה הנבחרת ======
  const renderDemo = () => {
    switch (activeDemo) {
      case 'simple':
        return (
          <div className="demo-container">
            <h2>📝 טופס פשוט (Simple Form)</h2>
            <p className="description">
              דוגמה בסיסית של טופס עם Controlled Components.
              <br />
              כל השדות מנוהלים על ידי React state.
            </p>
            <SimpleForm />
          </div>
        );

      case 'validated':
        return (
          <div className="demo-container">
            <h2>✅ טופס עם אימות (Validated Form)</h2>
            <p className="description">
              טופס עם אימות מלא - Regex, בדיקות תקינות, והצגת שגיאות.
              <br />
              כולל Password Strength Indicator.
            </p>
            <ValidatedForm />
          </div>
        );

      case 'hook':
        return (
          <div className="demo-container">
            <h2>🎣 טופס עם Custom Hook</h2>
            <p className="description">
              שימוש ב-useForm hook - גישה reusable וקלה יותר.
              <br />
              כל הלוגיקה של הטופס ב-hook אחד!
            </p>
            <LoginFormWithHook />
          </div>
        );

      case 'image':
        return (
          <div className="demo-container">
            <h2>📷 העלאת תמונה (Image Upload)</h2>
            <p className="description">
              העלאת קבצים עם FileReader API.
              <br />
              כולל תצוגה מקדימה (preview) ואימות קבצים.
            </p>
            <ImageUpload />
          </div>
        );

      case 'dragdrop':
        return (
          <div className="demo-container">
            <h2>🖱️ Drag & Drop Upload</h2>
            <p className="description">
              העלאת קבצים עם Drag & Drop.
              <br />
              תומך גם בבחירת קבצים רגילה (fallback).
            </p>
            <DragDropUpload />
          </div>
        );

      case 'registration':
        return (
          <div className="demo-container">
            <h2>🎯 טופס הרשמה מלא (Complete Registration)</h2>
            <p className="description">
              טופס הרשמה מקיף המשלב את כל הטכניקות:
              <br />
              • useForm hook לניהול הטופס
              <br />
              • Validation מתקדם לכל השדות
              <br />
              • העלאת תמונת פרופיל
              <br />
              • Password strength indicator
              <br />
              • אישור תנאי שימוש
              <br />• טיפול בשגיאות ו-loading states
            </p>
            <RegistrationForm />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      {/* ====== Header ====== */}
      <header className="app-header">
        <h1>📚 Forms Advanced - React Examples</h1>
        <p>דוגמאות לטפסים מתקדמים ב-React</p>
      </header>

      {/* ====== Navigation Menu ====== */}
      <nav className="demo-nav">
        <button
          className={activeDemo === 'registration' ? 'active' : ''}
          onClick={() => setActiveDemo('registration')}
        >
          🎯 טופס הרשמה מלא
        </button>

        <button
          className={activeDemo === 'simple' ? 'active' : ''}
          onClick={() => setActiveDemo('simple')}
        >
          📝 טופס פשוט
        </button>

        <button
          className={activeDemo === 'validated' ? 'active' : ''}
          onClick={() => setActiveDemo('validated')}
        >
          ✅ טופס עם אימות
        </button>

        <button
          className={activeDemo === 'hook' ? 'active' : ''}
          onClick={() => setActiveDemo('hook')}
        >
          🎣 useForm Hook
        </button>

        <button
          className={activeDemo === 'image' ? 'active' : ''}
          onClick={() => setActiveDemo('image')}
        >
          📷 העלאת תמונה
        </button>

        <button
          className={activeDemo === 'dragdrop' ? 'active' : ''}
          onClick={() => setActiveDemo('dragdrop')}
        >
          🖱️ Drag & Drop
        </button>
      </nav>

      {/* ====== Content ====== */}
      <main className="app-main">{renderDemo()}</main>

      {/* ====== Footer ====== */}
      <footer className="app-footer">
        <p>
          💡 <strong>טיפ:</strong> פתח את Developer Console (F12) כדי לראות את
          הנתונים שנשלחים!
        </p>
        <p>
          📖 עבור לקוד המקור כדי לראות את ההסברים המפורטים בהערות
        </p>
      </footer>

      {/* ====== Styles ====== */}
      <style>{`
        .App {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .app-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .app-header h1 {
          margin: 0;
          font-size: 2.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .app-header p {
          margin: 0.5rem 0 0 0;
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .demo-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .demo-nav button {
          padding: 0.75rem 1.5rem;
          background: white;
          border: 2px solid transparent;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .demo-nav button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .demo-nav button.active {
          background: #4caf50;
          color: white;
          border-color: #45a049;
        }

        .app-main {
          max-width: 1200px;
          margin: 0 auto;
        }

        .demo-container {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-in;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .demo-container h2 {
          margin-top: 0;
          color: #333;
          border-bottom: 3px solid #4caf50;
          padding-bottom: 0.5rem;
        }

        .description {
          background: #f5f5f5;
          padding: 1rem;
          border-right: 4px solid #4caf50;
          margin: 1rem 0 2rem 0;
          line-height: 1.6;
          color: #555;
        }

        .app-footer {
          text-align: center;
          color: white;
          margin-top: 3rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }

        .app-footer p {
          margin: 0.5rem 0;
        }

        /* סטיילים גלובליים לכל הטפסים */
        .form {
          max-width: 500px;
          margin: 0 auto;
        }

        .form-field {
          margin-bottom: 1.5rem;
        }

        .form-field label {
          display: block;
          margin-bottom: 0.5rem;
          color: #333;
          font-weight: 600;
        }

        .form-field input {
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
          border-color: #4caf50;
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

        .form button[type='submit'] {
          width: 100%;
          padding: 1rem;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .form button[type='submit']:hover {
          background: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .App {
            padding: 1rem;
          }

          .app-header h1 {
            font-size: 1.8rem;
          }

          .demo-nav {
            flex-direction: column;
          }

          .demo-nav button {
            width: 100%;
          }

          .demo-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
