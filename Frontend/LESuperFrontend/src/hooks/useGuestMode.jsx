import { useState, useEffect } from 'react';

export function useGuestMode() {
  const [guestMode, setGuestMode] = useState(false);

  useEffect(() => {
    const isGuest = localStorage.getItem('guestMode') === 'true';
    setGuestMode(isGuest);
  }, []);

  const setGuestModeStatus = (isGuest) => {
    if (isGuest) {
      localStorage.setItem('guestMode', 'true');
    } else {
      localStorage.removeItem('guestMode');
    }
    setGuestMode(isGuest);
  };

  return { guestMode, setGuestMode: setGuestModeStatus };
}