import { useEffect } from 'react';

interface TamilInputSetupProps {
  elementRef: HTMLElement | null;
  enabled: boolean;
}

export function useTamilInputSetup({ elementRef, enabled }: TamilInputSetupProps) {
  useEffect(() => {
    if (!enabled || !elementRef) return;

    const script = document.createElement('script');
    script.src = "https://www.google.com/jsapi";
    
    script.onload = () => {
      window.google.load("elements", "1", {
        packages: ["transliteration"],
        callback: () => {
          const control = new window.google.elements.transliteration.TransliterationControl({
            sourceLanguage: 'en',
            destinationLanguage: ['ta'],
            shortcutKey: 'ctrl+g',
            transliterationEnabled: true
          });
          
          control.makeTransliteratable([elementRef]);
          control.toggleTransliteration();
        }
      });
    };

    if (!document.querySelector('script[src="https://www.google.com/jsapi"]')) {
      document.head.appendChild(script);
    }

    return () => {
      const scriptElement = document.querySelector('script[src="https://www.google.com/jsapi"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, [elementRef, enabled]);
}