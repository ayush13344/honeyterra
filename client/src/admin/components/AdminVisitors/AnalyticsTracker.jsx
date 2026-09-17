import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const VISITOR_ID_KEY = "honeyterra_visitor_id";
const SESSION_ID_KEY = "honeyterra_session_id";
const SESSION_TIME_KEY = "honeyterra_session_time";

const generateId = () => {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return (
    Date.now().toString(36) +
    Math.random().toString(36).substring(2)
  );
};

const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = generateId();

    localStorage.setItem(
      VISITOR_ID_KEY,
      visitorId
    );
  }

  return visitorId;
};

const getSessionId = () => {
  const now = Date.now();

  const existingSessionId =
    sessionStorage.getItem(SESSION_ID_KEY);

  const existingSessionTime = Number(
    sessionStorage.getItem(SESSION_TIME_KEY) || 0
  );

  const SESSION_DURATION = 30 * 60 * 1000;

  if (
    existingSessionId &&
    now - existingSessionTime < SESSION_DURATION
  ) {
    sessionStorage.setItem(
      SESSION_TIME_KEY,
      now.toString()
    );

    return existingSessionId;
  }

  const newSessionId = generateId();

  sessionStorage.setItem(
    SESSION_ID_KEY,
    newSessionId
  );

  sessionStorage.setItem(
    SESSION_TIME_KEY,
    now.toString()
  );

  return newSessionId;
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageVisit = async () => {
      try {
        const visitorId = getVisitorId();
        const sessionId = getSessionId();

        await axios.post(
          `${API_URL}/api/analytics/visit`,
          {
            visitorId,
            sessionId,
            page: location.pathname,
            referrer: document.referrer || "",
          }
        );
      } catch (error) {
        console.error(
          "Analytics tracking failed:",
          error
        );
      }
    };

    trackPageVisit();
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;