import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export type FieldIconName =
  | "calendar"
  | "chevron"
  | "document"
  | "heart"
  | "location"
  | "mail"
  | "medical"
  | "message"
  | "money"
  | "phone"
  | "user"
  | "users";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  icon?: FieldIconName;
  label: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
  icon?: FieldIconName;
  label: string;
};

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  icon?: FieldIconName;
  label: string;
};

export function FormInputField({ icon, label, ...inputProps }: InputFieldProps) {
  return (
    <label className="form-field">
      {label}
      <span className={`form-field__control${icon ? " form-field__control--with-icon" : ""}`}>
        <input {...inputProps} />
        {icon ? <FormControlIcon name={icon} /> : null}
      </span>
    </label>
  );
}

export function FormSelectField({ children, icon, label, ...selectProps }: SelectFieldProps) {
  return (
    <label className="form-field">
      {label}
      <span className={`form-field__control${icon ? " form-field__control--with-icon" : ""}`}>
        <select {...selectProps}>{children}</select>
        {icon ? <FormControlIcon name={icon} /> : null}
      </span>
    </label>
  );
}

export function FormTextareaField({ icon, label, ...textareaProps }: TextareaFieldProps) {
  return (
    <label className="form-field">
      {label}
      <span className={`form-field__control form-field__control--textarea${icon ? " form-field__control--with-icon" : ""}`}>
        <textarea {...textareaProps} />
        {icon ? <FormControlIcon name={icon} /> : null}
      </span>
    </label>
  );
}

function FormControlIcon({ name }: { name: FieldIconName }) {
  switch (name) {
    case "calendar":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 6h14v14H5z" />
            <path d="M8 4v4M16 4v4M5 10h14" />
          </svg>
        </span>
      );
    case "document":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M7 4h7l3 3v13H7z" />
            <path d="M14 4v4h4M9 12h6M9 16h6" />
          </svg>
        </span>
      );
    case "heart":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
          </svg>
        </span>
      );
    case "location":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 21s7-5.4 7-12a7 7 0 0 0-14 0c0 6.6 7 12 7 12z" />
            <circle cx="12" cy="9" r="2.4" />
          </svg>
        </span>
      );
    case "mail":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16v12H4z" />
            <path d="m4 7 8 6 8-6" />
          </svg>
        </span>
      );
    case "medical":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M9 4h6v6h5v6h-5v5H9v-5H4v-6h5z" />
          </svg>
        </span>
      );
    case "message":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 5h14v10H9l-4 4z" />
          </svg>
        </span>
      );
    case "money":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M5 7h14v10H5z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        </span>
      );
    case "phone":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M8 5 6 7c-.6.6-.7 1.5-.3 2.3 1.9 3.8 4.9 6.8 8.7 8.7.8.4 1.7.3 2.3-.3l2-2-3.2-3.2-1.7 1.7c-1.7-.9-3.1-2.3-4-4L11.4 8 8 5z" />
          </svg>
        </span>
      );
    case "user":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="3.5" />
            <path d="M5 20c.8-4.2 3.2-6.2 7-6.2s6.2 2 7 6.2" />
          </svg>
        </span>
      );
    case "users":
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="9" cy="9" r="3" />
            <circle cx="17" cy="10" r="2.5" />
            <path d="M4 19c.6-3 2.4-5 5-5s4.4 2 5 5" />
            <path d="M14 18c.6-2.1 1.9-3.4 3.8-3.4 1.5 0 2.7.8 3.2 2.4" />
          </svg>
        </span>
      );
    default:
      return (
        <span className="form-field__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="m7 9 5 5 5-5" />
          </svg>
        </span>
      );
  }
}
