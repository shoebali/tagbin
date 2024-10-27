// src/hooks/usePayPalScript.js
import { useEffect } from 'react';

const usePayPalScript = (clientId) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
    script.async = true;
    script.onload = () => {
      console.log('PayPal SDK script loaded');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);
};

export default usePayPalScript;
