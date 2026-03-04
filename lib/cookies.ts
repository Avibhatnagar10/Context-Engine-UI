export function hasCookieConsent(): boolean {
    if (typeof window === "undefined") return false;
  
    const consent = localStorage.getItem("cookie-consent");
  
    return consent === "accepted";
  }