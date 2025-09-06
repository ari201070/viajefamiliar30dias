
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App.tsx';
import { askGemini, translateText } from '../services/apiService.ts';
import { parseMarkdownLinks } from '../utils/markdownParser.ts';

interface AIResponse {
  original: string;
  translated: string | null;
}

interface ReusableAIChatProps {
  titleKey: string;
  iconClass: string;
  basePrompt: string;
  cityContext?: string;
}

const ReusableAIChat: React.FC<ReusableAIChatProps> = ({ titleKey, iconClass, basePrompt, cityContext }) => {
  const { t, language } = useAppContext();
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const prevLangRef = useRef(language);

  useEffect(() => {
    if (prevLangRef.current !== language) {
        setResponse(null);
    }
    prevLangRef.current = language;
  }, [language]);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setResponse(null);
    
    const fullPrompt = `${basePrompt} ${cityContext || ''}. The user asks: ${userInput}`;

    try {
      const result = await askGemini(fullPrompt, 'es');
      setResponse({ original: result, translated: null });
    } catch (error) {
      setResponse({ original: t('iaError'), translated: null });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!response || !response.original) return;
    setIsTranslating(true);
    try {
        const translatedText = await translateText(response.original, language);
        setResponse(prev => (prev ? { ...prev, translated: translatedText } : null));
    } catch (error) {
        setResponse(prev => (prev ? { ...prev, translated: t('translation_error') } : null));
    } finally {
        setIsTranslating(false);
    }
  };

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-700 transition-shadow duration-300 ease-in-out";
  const sectionTitleClasses = "text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 pb-2 border-b border-indigo-200 dark:border-slate-600 flex items-center";

  return (
    <section className={cardClasses}>
      <h2 className={sectionTitleClasses}>
        <i className={`fas ${iconClass} mr-3 text-xl`}></i>
        {t(titleKey)}
      </h2>
      <p className="text-gray-600 dark:text-slate-400 mb-4 whitespace-pre-line">{t(titleKey + '_description')}</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={t(titleKey + '_placeholder')}
          className="flex-grow p-2 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i> {t('generating')}</> : <><i className="fas fa-paper-plane mr-2"></i> {t('generate_btn')}</>}
        </button>
      </div>

      {response && response.original && (
        <div className="mt-5 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg shadow-inner border border-gray-200 dark:border-slate-700">
          <div className="whitespace-pre-line text-gray-700 dark:text-slate-300">
            {parseMarkdownLinks(response.original)}
          </div>
          {language === 'he' && !response.translated && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 text-right">
              <button 
                onClick={handleTranslate} 
                disabled={isTranslating}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 disabled:opacity-50 flex items-center justify-end ml-auto"
              >
                {isTranslating ? <><i className="fas fa-spinner fa-spin mr-1.5"></i>{t('translating')}</> : <><img src="/google-ad-services.svg" className="w-4 h-4 mr-1.5" alt="Google AD"/>{t('translate_to_hebrew')}</>}
              </button>
            </div>
          )}
          {response.translated && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600 whitespace-pre-line text-gray-700 dark:text-slate-300">
               {parseMarkdownLinks(response.translated)}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ReusableAIChat;