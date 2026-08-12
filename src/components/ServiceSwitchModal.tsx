"use client";

import { useEffect, useState } from "react";
import "./ServiceSwitchModal.css";

interface ServiceSwitchModalProps {
  message: string;
  switchHref: string;
}

const COOKIE_NAME = "service_switch_modal_seen";

export function ServiceSwitchModal({
  message,
  switchHref,
}: ServiceSwitchModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`));

    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    // Save cookie for 30 days
    document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${
      60 * 60 * 24 * 30
    }; SameSite=Lax`;

    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="ssm-overlay" role="presentation" onClick={handleClose}>
      <div
        className="ssm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-switch-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="ssm-close-button"
          onClick={handleClose}
          aria-label="Close"
        >
          &times;
        </button>

        <p id="service-switch-title" className="ssm-text">
          {message}
        </p>

        <div className="ssm-actions">
          <a
            href={switchHref}
            className="ssm-switch-button"
            onClick={handleClose}
          >
            Switch
          </a>

          <button
            type="button"
            className="ssm-stay-button"
            onClick={handleClose}
          >
            Stay Here
          </button>
        </div>
      </div>
    </div>
  );
}
