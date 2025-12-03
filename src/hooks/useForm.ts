import { useState, type ChangeEvent, type FormEvent, type FocusEvent } from 'react';

// ====== הגדרות טיפוסים (Type Definitions) ======

// כלל אימות - מכיל פונקציה שמקבלת ערך ומחזירה שגיאה או undefined
interface ValidationRule<T> {
  validate: (value: T) => string | undefined;
}

// אוסף של כללי אימות לכל שדות הטופס
// Mapped type: לכל מפתח בטיפוס T, אפשר להגדיר כלל אימות
type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>;
  
};

// מה ש-hook מחזיר למשתמש
interface UseFormReturn<T> {
  values: T;                          // ערכי הטופס הנוכחיים
  errors: Partial<Record<keyof T, string>>;  // שגיאות (לא בהכרח לכל השדות)
  touched: Partial<Record<keyof T, boolean>>; // אילו שדות נגעו בהם
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void) => (e: FormEvent) => void;
  reset: () => void;                  // איפוס הטופס
}

/**
 * Custom Hook לניהול טפסים
 *
 * @param initialValues - ערכי התחלה לטופס
 * @param validationRules - כללי אימות אופציונליים
 * @returns אובייקט עם כל מה שצריך לטופס
 *
 * דוגמה לשימוש:
 * const form = useForm({ email: '', password: '' }, {
 *   email: { validate: (v) => !v ? 'חובה' : undefined }
 * });
 */
function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules?: ValidationRules<T>
): UseFormReturn<T> {

  // ====== State Management ======

  // ערכי הטופס
  const [values, setValues] = useState<T>(initialValues);

  // שגיאות אימות
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  // מעקב אחרי שדות שנגעו בהם
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  // ====== Validation Functions ======

  /**
   * מאמת שדה בודד
   * @param name - שם השדה
   * @param value - ערך השדה
   * @returns הודעת שגיאה או undefined
   */
  const validate = (name: keyof T, value: unknown): string | undefined => {
    // אם יש כללי אימות והוגדר כלל לשדה הזה - הרץ אותו
    if (validationRules && validationRules[name]) {
      return validationRules[name]!.validate(value as T[keyof T]);
    }
    return undefined;
  };

  /**
   * מאמת את כל השדות בטופס
   * @returns אובייקט עם כל השגיאות
   */
  const validateAll = (): Partial<Record<keyof T, string>> => {
    const newErrors: Partial<Record<keyof T, string>> = {};

    // אם אין כללי אימות - אין שגיאות
    if (validationRules) {
      // עובר על כל השדות שיש להם כללי אימות
      Object.keys(validationRules).forEach((key) => {
        const error = validate(key as keyof T, values[key]);
        if (error) {
          newErrors[key as keyof T] = error;
        }
      });
    }

    return newErrors;
  };

  // ====== Event Handlers ======

  /**
   * מטפל בשינוי ערך בשדה
   * עובד עם input ו-textarea
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // עדכון הערך
    setValues(prev => ({ ...prev, [name]: value }));

    // אם נגעו בשדה הזה - אמת אותו בזמן אמת
    // זה נותן feedback מיידי למשתמש
    if (touched[name as keyof T]) {
      const error = validate(name as keyof T, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  /**
   * מטפל באירוע blur (עזיבת שדה)
   * מסמן שנגעו בשדה ומאמת אותו
   */
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;

    // מסמן שנגעו בשדה
    setTouched(prev => ({ ...prev, [name]: true }));

    // מריץ אימות
    const error = validate(name as keyof T, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  /**
   * יוצר פונקציה לטיפול בשליחת הטופס
   * זו פונקציה שמחזירה פונקציה (Higher-Order Function)
   *
   * @param onSubmit - מה לעשות עם הנתונים התקינים
   * @returns פונקציה שמטפלת באירוע ה-submit
   */
  const handleSubmit = (onSubmit: (values: T) => void) => (e: FormEvent) => {
    // מונע רענון דף
    e.preventDefault();

    // אימות מלא של כל השדות
    const validationErrors = validateAll();
    setErrors(validationErrors);

    // בדיקה אם יש שגיאות
    // Object.values מחזיר מערך של כל הערכים
    // some בודק אם יש לפחות אחד שאמיתי (truthy)
    const hasErrors = Object.values(validationErrors).some(error => error);

    // אם אין שגיאות - קורא לפונקציית ה-callback עם הנתונים
    if (!hasErrors) {
      onSubmit(values);
    }
  };

  /**
   * מאפס את הטופס למצב ההתחלתי
   */
  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  // ====== Return ======

  // מחזיר את כל מה שצריך לטופס
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
  };
}

export default useForm;
