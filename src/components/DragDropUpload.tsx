import { useState, DragEvent } from 'react';

function DragDropUpload() {
  // ====== State Management ======

  // כתובת ה-preview של התמונה
  const [preview, setPreview] = useState<string>('');

  // הקובץ שנבחר
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // האם המשתמש גורר משהו מעל האזור? (לסטיילינג)
  const [isDragging, setIsDragging] = useState(false);

  // ====== Helper Functions ======

  /**
   * פונקציית עזר ליצירת preview מקובץ
   * @param file - הקובץ ליצירת preview
   */
  const createPreview = (file: File) => {
    // בדיקה שזו תמונה
    if (!file.type.startsWith('image/')) {
      alert('ניתן להעלות רק קבצי תמונה');
      return;
    }

    // בדיקת גודל (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('התמונה גדולה מדי! מקסימום 5MB');
      return;
    }

    // שמירת הקובץ
    setSelectedFile(file);

    // יצירת preview עם FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ====== Drag & Drop Event Handlers ======

  /**
   * מופעל כשגוררים משהו מעל האזור
   * @param e - אירוע הדרג
   */
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    // preventDefault חשוב! ללא זה, הדפדפן ינסה לפתוח את הקובץ
    e.preventDefault();

    // מעדכן שאנחנו בגרירה - לסטיילינג
    setIsDragging(true);
  };

  /**
   * מופעל כשהגרירה עוזבת את האזור
   * (המשתמש זז עם העכבר החוצה מהאזור)
   */
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  /**
   * מופעל כשמשחררים את הקובץ באזור
   * זה האירוע החשוב ביותר!
   * @param e - אירוע הדרופ
   */
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    // preventDefault - מונע מהדפדפן לפתוח את הקובץ
    e.preventDefault();

    // מעדכן שהגרירה הסתיימה
    setIsDragging(false);

    // ====== קבלת הקובץ ======

    // e.dataTransfer.files מכיל את הקבצים שנגררו
    // לוקחים את הראשון
    const file = e.dataTransfer.files[0];

    // אם יש קובץ - יוצרים preview
    if (file) {
      createPreview(file);
    }
  };

  /**
   * מופעל כשבוחרים קובץ דרך ה-input (fallback)
   * @param e - אירוע השינוי
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      createPreview(file);
    }
  };

  /**
   * העלאת הקובץ לשרת
   */
  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('הועלה בהצלחה!', data);
        alert('התמונה הועלתה בהצלחה!');

        // איפוס אחרי העלאה מוצלחת
        setPreview('');
        setSelectedFile(null);
      } else {
        console.error('שגיאה:', response.status);
        alert('שגיאה בהעלאת התמונה');
      }
    } catch (error) {
      console.error('שגיאה:', error);
      alert('שגיאה בהעלאת התמונה');
    }
  };

  /**
   * ביטול ואיפוס
   */
  const handleClear = () => {
    setPreview('');
    setSelectedFile(null);
    setIsDragging(false);
  };

  // ====== Render ======

  return (
    <div className="drag-drop-container">
      <h2>העלאת תמונה - Drag & Drop</h2>

      {/* ===== Drop Zone ===== */}

      {/* האזור שאפשר לגרור אליו קבצים */}
      <div
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        // שלושת האירועים החשובים ל-Drag & Drop:
        onDragOver={handleDragOver}   // גוררים מעל
        onDragLeave={handleDragLeave} // עוזבים את האזור
        onDrop={handleDrop}           // משחררים (זורקים) באזור
        onClick={() => document.getElementById('file-input-dnd')?.click()}
      >
        {/* אם יש preview - מציגים את התמונה */}
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Uploaded" className="preview-image" />
            <div className="file-info">
              <p>📄 {selectedFile?.name}</p>
              <p>📏 {selectedFile && (selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        ) : (
          // אם אין preview - מציגים הוראות
          <div className="drop-instructions">
            {/* אם בגרירה - הודעה מעודדת */}
            {isDragging ? (
              <p className="drop-here">🎯 שחרר כאן!</p>
            ) : (
              <>
                <p className="main-text">🖼️ גרור תמונה לכאן</p>
                <p className="sub-text">או לחץ לבחירת קובץ</p>
                <div className="formats">
                  <small>PNG, JPG, GIF עד 5MB</small>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ===== Hidden File Input (fallback) ===== */}

      {/* input מוסתר - לאנשים שלא רוצים drag & drop */}
      <input
        type="file"
        id="file-input-dnd"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* ===== Action Buttons ===== */}

      {/* כפתורים - מופיעים רק אם יש תמונה */}
      {preview && (
        <div className="action-buttons">
          <button onClick={handleUpload} className="btn-primary">
            ⬆️ העלה לשרת
          </button>
          <button onClick={handleClear} className="btn-secondary">
            🗑️ נקה
          </button>
        </div>
      )}

      {/* ===== Info Box ===== */}

      <div className="info-box">
        <h3>איך זה עובד?</h3>
        <ol>
          <li>
            <strong>onDragOver:</strong> מופעל כשגוררים מעל האזור.
            חייב לקרוא ל-<code>preventDefault()</code> כדי לאפשר drop.
          </li>
          <li>
            <strong>onDragLeave:</strong> מופעל כשעוזבים את האזור בזמן גרירה.
            שימושי לעדכון סטיילינג.
          </li>
          <li>
            <strong>onDrop:</strong> מופעל כשמשחררים את הקובץ.
            כאן מקבלים את הקובץ מ-<code>e.dataTransfer.files</code>
          </li>
        </ol>
      </div>

      {/* ===== CSS ב-inline לדוגמה ===== */}
      <style>{`
        .drag-drop-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .drop-zone {
          border: 3px dashed #ccc;
          border-radius: 12px;
          padding: 3rem;
          text-align: center;
          transition: all 0.3s ease;
          cursor: pointer;
          background: #fafafa;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* סטיילינג כשגוררים מעל */
        .drop-zone.dragging {
          border-color: #4CAF50;
          background: #e8f5e9;
          transform: scale(1.02);
        }

        .drop-instructions .main-text {
          font-size: 1.5rem;
          margin: 1rem 0;
          color: #333;
        }

        .drop-instructions .sub-text {
          color: #666;
          margin: 0.5rem 0;
        }

        .drop-instructions .drop-here {
          font-size: 2rem;
          color: #4CAF50;
          animation: pulse 1s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .preview-container {
          width: 100%;
        }

        .preview-image {
          max-width: 100%;
          max-height: 300px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .file-info {
          margin-top: 1rem;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          justify-content: center;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 2rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
        }

        .btn-primary:hover {
          background: #45a049;
        }

        .btn-secondary {
          background: #f44336;
          color: white;
        }

        .btn-secondary:hover {
          background: #da190b;
        }

        .info-box {
          margin-top: 2rem;
          padding: 1.5rem;
          background: #f5f5f5;
          border-radius: 8px;
        }

        .info-box h3 {
          margin-top: 0;
        }

        .info-box ol {
          text-align: right;
        }

        .info-box code {
          background: #e0e0e0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
        }

        .formats {
          margin-top: 1rem;
          color: #999;
        }
      `}</style>
    </div>
  );
}

export default DragDropUpload;
