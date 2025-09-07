import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../App.tsx';
import { AIPromptContent, City, ChatMessage, Language } from '../types.ts';
import { sendMessageInChat, translateText } from '../services/apiService.ts';
import { v4 as uuidv4 } from 'uuid';

interface AIChatBoxProps {
  config: AIPromptContent;
  city: City;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ config, city }) => {
  const { t, language } = useAppContext();
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const storageKey = `chatHistory_${city.id}_${config.promptKeySuffix}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load chat history from localStorage", e);
      return [];
    }
  });

  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);


  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, storageKey]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (trimmedInput === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: trimmedInput,
      originalLang: language,
      translations: {},
    };
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    const basePromptKey = `${city.id}${config.promptKeySuffix}`;
    let systemInstruction = t(basePromptKey, { cityName: t(city.nameKey) });
    if (systemInstruction === basePromptKey) {
        const genericPromptKey = `generic${basePromptKey.substring(city.id.length)}`;
        systemInstruction = t(genericPromptKey, { cityName: t(city.nameKey) });
    }

    try {
      const responseText = await sendMessageInChat(systemInstruction, messages, trimmedInput, language);
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        text: responseText,
        originalLang: language,
        translations: {},
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'model',
        text: t('iaError'),
        originalLang: language,
        translations: {},
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTranslate = async (messageId: string) => {
    const messageToTranslate = messages.find(m => m.id === messageId);
    if (!messageToTranslate) return;

    setTranslatingId(messageId);
    try {
        const translatedText = await translateText(messageToTranslate.text, language);
        setMessages(currentMessages =>
            currentMessages.map(m => {
                if (m.id === messageId) {
                    return {
                        ...m,
                        translations: {
                            ...m.translations,
                            [language]: translatedText,
                        },
                    };
                }
                return m;
            })
        );
    } catch (error) {
        console.error("Translation failed", error);
        // Optionally show an error message to the user
    } finally {
        setTranslatingId(null);
    }
};

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-700 transition-shadow duration-300 ease-in-out flex flex-col";
  const sectionTitleClasses = "text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 pb-2 border-b border-indigo-200 dark:border-slate-600 flex items-center";
  const detailTextClasses = "text-gray-700 dark:text-slate-300 leading-relaxed";

  return (
    <section className={cardClasses} style={{ minHeight: '500px' }}>
      <h2 className={sectionTitleClasses}>
        <i className={`fas ${config.icon} mr-3 text-xl text-indigo-500 dark:text-indigo-400`}></i>
        {t(config.titleKey)}
      </h2>
      <p className={`${detailTextClasses} mb-4 flex-shrink-0`}>
        {t(config.descriptionKey, { cityName: t(city.nameKey) })}
      </p>
      
      <div 
        ref={chatHistoryRef} 
        className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4 bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700"
      >
        {messages.map(msg => {
          const showTranslateButton = msg.role === 'model' && msg.originalLang !== language && !msg.translations?.[language];
          const targetLangName = t(`language_name_${language}`);
          const originalLangName = t(`language_name_${msg.originalLang}`);

          return (
            <div key={msg.id} className={`flex flex-col items-start ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                  ? 'bg-indigo-500 text-white rounded-br-lg' 
                  : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-lg'
                }`}>
                  {msg.text}
                  {msg.translations?.[language] && (
                    <div className="mt-2 pt-2 border-t border-gray-300 dark:border-slate-600">
                      <p className="text-xs font-semibold opacity-75 mb-1">{t('ai_translated_from_label', { lang: originalLangName })}</p>
                      <p>{msg.translations[language]}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {showTranslateButton && (
                 <button 
                    onClick={() => handleTranslate(msg.id)}
                    disabled={translatingId === msg.id}
                    className="mt-1.5 ml-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 disabled:cursor-wait"
                 >
                    {translatingId === msg.id ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                      <>
                        <i className="fas fa-language mr-1"></i>
                        {t('ai_translate_button_text', { lang: targetLangName })}
                      </>
                    )}
                 </button>
              )}
            </div>
          )
        })}
        {isLoading && (
            <div className="flex justify-start">
                <div className="px-4 py-2 rounded-2xl shadow-sm bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-bl-lg">
                    <div className="flex items-center justify-center space-x-1">
                        <span className="w-2 h-2 bg-gray-500 dark:bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 dark:bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-gray-500 dark:bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                    </div>
                </div>
            </div>
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex-shrink-0 flex items-center gap-3">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
              }
          }}
          placeholder={t('ai_chat_input_placeholder')}
          rows={1}
          className="flex-grow p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none"
          disabled={isLoading}
          style={{ minHeight: '50px' }}
        />
        <button
          type="submit"
          disabled={isLoading || userInput.trim() === ''}
          className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-all transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 h-[50px] w-[60px] flex items-center justify-center"
          aria-label={t('ai_chat_send_button')}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin text-xl"></i>
          ) : (
            <i className="fas fa-paper-plane text-xl"></i>
          )}
        </button>
      </form>
    </section>
  );
};

export default AIChatBox;