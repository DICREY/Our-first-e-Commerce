
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logEvent } from "firebase/analytics";
import { analytics } from './AuthFirebase';


export const AnalyticsTracker = () => {
  const location = useLocation()

  useEffect(() => {
    logEvent(analytics, 'page_view',{
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
    })
  }, [location])

  return null
}