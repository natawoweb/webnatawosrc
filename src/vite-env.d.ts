/// <reference types="vite/client" />

interface Window {
  google: {
    load: (
      apiName: string,
      version: string,
      options: {
        packages: string[];
        callback: () => void;
      }
    ) => void;
    elements: {
      transliteration: {
        TransliterationControl: new (options: {
          sourceLanguage: string;
          destinationLanguage: string[];
          shortcutKey: string;
          transliterationEnabled: boolean;
        }) => {
          makeTransliteratable: (elements: HTMLElement[]) => void;
          toggleTransliteration: () => void;
        };
      };
    };
  };
}