import { useState, type FormEvent } from 'react';

// הגדרת ממשק (interface) לנתוני הטופס
// כל שדה בטופס מקבל טיפוס משלו
interface FormData {
  email: string;
  password: string;
  name: string;
}

function SimpleForm() {
  // ניהול מצב הטופס - כל השדות נשמרים באובייקט אחד
  // זו גישת "Controlled Components" - React שולט בערכי השדות
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });

  // פונקציה אחת לטיפול בכל השינויים בשדות
  // הפונקציה מקבלת אירוע (event) מכל input שמשתנה
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // destructuring - מוציאים את name ו-value מה-input שהשתנה
    const { name, value } = e.target;

    // עדכון המצב - שומרים את כל הנתונים הקיימים (...prev)
    // ומעדכנים רק את השדה הספציפי שהשתנה ([name]: value)
    // [name] זה "computed property name" - משתמשים בערך של name כמפתח
    setFormData(prev => ({
      ...prev,      // שומר את כל השדות האחרים
      [name]: value, // מעדכן רק את השדה הנוכחי
    }));
  };

  // טיפול בשליחת הטופס
  const handleSubmit = (e: FormEvent) => {
    // מונע רענון אוטומטי של הדף (התנהגות ברירת מחדל של טפסים)
    e.preventDefault();

    // כאן אפשר לשלוח את הנתונים לשרת
    console.log('נתוני הטופס שנשלחו:', formData);
  };

  return (
    // onSubmit מופעל כשלוחצים על כפתור submit או Enter בשדה
    <form onSubmit={handleSubmit}>
      <div>
      {/* שדה שם */}
     <label htmlFor="name">שם מלא:</label>
      <input
        type="text"
        name="name"                    // שם השדה - חייב להתאים למפתח ב-FormData
        value={formData.name}          // הערך נשלט על ידי React (controlled)
        onChange={handleChange}        // כל שינוי מעדכן את ה-state
        placeholder="שם מלא"
      />
 </div>
     <div>
      {/* שדה אימייל */}
    <label htmlFor="email">אימייל:</label>
      <input
        type="email"                   // type="email" נותן validation בסיסי מהדפדפן
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="אימייל"
      />
</div>
<div>
      {/* שדה סיסמה */}
      <input
        type="password"                // type="password" מסתיר את התווים
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="סיסמה"
      />
</div>
      {/* כפתור שליחה */}
      <button type="submit">שלח</button>
    </form>
  );
}

export default SimpleForm;
