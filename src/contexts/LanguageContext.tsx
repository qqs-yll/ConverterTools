import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 使用useState的初始化函数，确保服务端和客户端一致
  const [language, setLanguage] = useState<Language>('zh');
  const [isClient, setIsClient] = useState(false);

  // 当语言改变时，保存到localStorage
  const handleLanguageChange = useCallback((lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('converter-tools-language', lang);
    }
  }, []);

  // 在客户端挂载后从localStorage读取语言设置
  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('converter-tools-language');
    if (saved === 'zh' || saved === 'en') {
      setLanguage(saved);
    }
  }, []);

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [language]);

  // 在服务端渲染时，始终返回中文翻译，避免hydration错误
  if (!isClient) {
    const tServer = (key: string) => {
      const keys = key.split('.');
      let value: any = translations.zh;
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }
      
      return typeof value === 'string' ? value : key;
    };

    return (
      <LanguageContext.Provider value={{ language: 'zh', setLanguage: handleLanguageChange, t: tServer }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 