"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type CookieConsentProps = {
  privacyHref?: string;
  className?: string;
};

const CookieConsent: React.FC<CookieConsentProps> = ({
  privacyHref = "#",
  className = "",
}) => {
    const [visible, setVisible] = useState(() => {
        if (typeof window === "undefined") return false;
      
        const consent = localStorage.getItem("cookie-consent");
        return !consent;
      });

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`relative w-full max-w-md rounded-2xl border bg-white text-neutral-800 border-neutral-200 shadow-2xl dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 p-6 sm:p-7 ${className}`}
          >
            {/* Cookie Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
              className="mx-auto mb-4 flex items-center justify-center text-6xl"
            >
              🍪
            </motion.div>

            {/* Content */}
            <div className="text-center space-y-3 mb-6">
              <h2
                id="cookie-title"
                className="text-xl font-bold text-neutral-800 dark:text-neutral-100"
              >
                Cookies Required for Login
              </h2>

              <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                This application requires <b>third-party cookies</b> to securely
                authenticate users using Google Sign-In.
                <br />
                <br />
                Please allow cookies so we can create a secure login session.
                If cookies are blocked in your browser, authentication may fail.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={acceptCookies}
                className="flex-1 px-4 py-2.5 font-semibold text-white bg-amber-700 hover:bg-amber-800 active:scale-[0.97] transition rounded-md"
              >
                Allow Cookies
              </button>

              <button
                onClick={declineCookies}
                className="flex-1 px-4 py-2.5 font-semibold bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 active:scale-[0.97] transition rounded-md"
              >
                Decline
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;