import { useState } from 'react';

function ImageUpload() {
  // ====== State Management ======

  // הקובץ שנבחר - יכול להיות File או null (לא נבחר עדיין)
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // כתובת ה-preview של התמונה - Data URL שאפשר להציג ב-img
  const [preview, setPreview] = useState<string>('');

  // ====== Event Handlers ======

  /**
   * מטפל בבחירת קובץ
   * מופעל כשהמשתמש בוחר קובץ דרך input[type="file"]
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // e.target.files זה FileList - רשימת קבצים
    // [0] לוקח את הקובץ הראשון (אנחנו מאפשרים רק קובץ אחד)
    // ?. זה optional chaining - אם files הוא null, לא תהיה שגיאה
    const file = e.target.files?.[0];

    // אם נבחר קובץ
    if (file) {
      // ====== בדיקת תקינות הקובץ ======

      // בדיקה 1: האם זו תמונה?
      // file.type מכיל את ה-MIME type (למשל: "image/jpeg", "image/png")
      // startsWith בודק אם מתחיל ב-"image/"
      if (!file.type.startsWith('image/')) {
        alert('בחר קובץ תמונה!');
        return; // יוצא מהפונקציה ולא ממשיך
      }

      // בדיקה 2: גודל הקובץ
      // file.size מחזיר בתים (bytes)
      // 1 MB = 1024 KB = 1024 * 1024 bytes
      // 5 * 1024 * 1024 = 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('התמונה גדולה מדי! מקסימום 5MB');
        return;
      }

      // ====== שמירת הקובץ ======
      setSelectedImage(file);

      // ====== יצירת Preview ======

      // FileReader זה API של הדפדפן לקריאת קבצים
      const reader = new FileReader();

      // onloadend - callback שמופעל כשהקריאה מסתיימת
      reader.onloadend = () => {
        // reader.result מכיל את התוצאה
        // במקרה של readAsDataURL, זה Data URL (string שמתחיל ב-"data:image/...")
        setPreview(reader.result as string);
      };

      // מתחיל לקרוא את הקובץ כ-Data URL
      // זה אסינכרוני - כשיסתיים, onloadend יופעל
      reader.readAsDataURL(file);
    }
  };

  /**
   * מטפל בהעלאת התמונה לשרת
   * מופעל כשלוחצים על כפתור "העלה"
   */
  const handleUpload = async () => {
    // אם אין קובץ - לא עושים כלום
    if (!selectedImage) return;

    // ====== הכנת הנתונים לשליחה ======

    // FormData זה API לשליחת קבצים
    // זה מה שמאפשר לשלוח קבצים ב-HTTP
    const formData = new FormData();

    // append מוסיף שדה ל-FormData
    // 'image' זה שם השדה (כמו name ב-input)
    // selectedImage זה הקובץ עצמו
    formData.append('image', selectedImage);

    // אפשר להוסיף עוד שדות:
    // formData.append('userId', '123');
    // formData.append('description', 'תמונת פרופיל');

    // ====== שליחה לשרת ======

    try {
      // fetch עם method: 'POST' ו-body: FormData
      // שים לב: אין headers! הדפדפן מוסיף אוטומטית Content-Type: multipart/form-data
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,  // לא צריך JSON.stringify!
      });

      // בדיקה אם הבקשה הצליחה (status 200-299)
      if (response.ok) {
        const data = await response.json();
        console.log('הועלה בהצלחה!', data);

        // אפשר לעשות משהו עם התגובה, למשל:
        // - להציג הודעת הצלחה
        // - לשמור את כתובת התמונה
        // - לנקות את הטופס
      } else {
        console.error('שגיאה בהעלאה:', response.status);
      }
    } catch (error) {
      // טיפול בשגיאות רשת (network errors)
      console.error('שגיאה:', error);
      alert('שגיאה בהעלאת התמונה');
    }
  };

  // ====== Render ======

  return (
    <div className="image-upload">
      <h2>העלאת תמונה</h2>

      {/* ===== Input להעלאת קובץ ===== */}

      {/* input[type="file"] זה השדה להעלאת קבצים */}
      <input
        type="file"
        accept="image/*"  // מאפשר רק קבצי תמונה
        onChange={handleFileChange}
        id="file-input"
        style={{ display: 'none' }}  // מסתיר את ה-input המכוער
      />

      {/* label שמחובר ל-input (דרך htmlFor + id) */}
      {/* לחיצה על ה-label = לחיצה על ה-input */}
      <label htmlFor="file-input" className="upload-button">
        📷 בחר תמונה
      </label>

      {/* ===== תצוגה מקדימה (Preview) ===== */}

      {/* מציג רק אם יש preview */}
      {preview && (
        <div className="preview">
          {/* הצגת התמונה */}
          {/* src={preview} - זה ה-Data URL שיצרנו */}
          <img src={preview} alt="Preview" style={{ maxWidth: '300px' }} />

          {/* מידע על הקובץ */}
          <p>שם הקובץ: {selectedImage?.name}</p>

          {/* גודל הקובץ בקילובייט */}
          {/* file.size הוא בתים, חלוקה ב-1024 נותנת KB */}
          {/* toFixed(2) מעגל ל-2 ספרות אחרי הנקודה */}
          <p>גודל: {(selectedImage!.size / 1024).toFixed(2)} KB</p>

          {/* כפתור העלאה */}
          <button onClick={handleUpload} className="upload-btn">
            📤 העלה לשרת
          </button>

          {/* כפתור ביטול */}
          <button
            onClick={() => {
              setSelectedImage(null);
              setPreview('');
            }}
            className="cancel-btn"
          >
            ❌ ביטול
          </button>
        </div>
      )}

      {/* ===== הסברים למשתמש ===== */}
      <div className="upload-info">
        <h3>הנחיות:</h3>
        <ul>
          <li>✅ קבצי תמונה בלבד (JPG, PNG, GIF, etc.)</li>
          <li>✅ גודל מקסימלי: 5MB</li>
          <li>✅ מומלץ: תמונה מרובעת</li>
        </ul>
      </div>
    </div>
  );
}

export default ImageUpload;
