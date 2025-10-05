import React, { useState, useEffect, useRef, FC } from 'react';
import { useAppContext } from '../context/AppContext.ts';
import { AIPromptContent, City, ChatMessage, Language, AIResponseType } from '../types.ts';
import { sendMessageInChat, translateText } from '../services/apiService.ts';
import { parseMarkdownLinks } from '../utils/markdownParser.ts';

interface AIChatBoxProps {
    config: AIPromptContent;
    city?: City;
    chatId: string; // Unique ID for storing chat history
}

const AIChatBox: FC<AIChatBoxProps> = ({ config, city, chatId }) => {
    const { t, language } = useAppContext();
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const title = t(config.titleKey, { cityName: city ? t(city.nameKey) : t('any_city_placeholder') });
    const description = t(config.descriptionKey, { cityName: city ? t(city.nameKey) : t('any_city_placeholder') });
    const placeholder = t(config.userInputPlaceholderKey);
    const basePrompt = t(city ? `${city.id}${config.promptKeySuffix}` : `homepage${config.promptKeySuffix}`, {
      familyInfo: t('family_info_for_ai'),
    });

    // Load history from localStorage on mount
    useEffect(() => {
        const savedHistory = localStorage.getItem(`chatHistory_${chatId}`);
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, [chatId]);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(history));
    }, [history, chatId]);
    
    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSendMessage = async () => {
        if (userInput.trim() === '' || isLoading) return;

        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: userInput,
            originalLang: language,
            translations: {}
        };

        setHistory(prev => [...prev, newUserMessage]);
        setUserInput('');
        setIsLoading(true);

        const fullPrompt = `${basePrompt}\n\nUser question: "${userInput}"`;

        try {
            const responseText = await sendMessageInChat(basePrompt, history, userInput, language);
            const newModelMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                originalLang: language,
                translations: {}
            };
            setHistory(prev => [...prev, newModelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: t('iaError'),
                originalLang: language,
                translations: {}
            };
            setHistory(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleTranslate = async (messageId: string, targetLang: Language) => {
        const messageIndex = history.findIndex(m => m.id === messageId);
        if (messageIndex === -1) return;
        
        const message = history[messageIndex];
        // If translation already exists, don't re-translate
        if(message.translations[targetLang]) return;

        const translatedText = await translateText(message.text, targetLang);
        
        const updatedHistory = [...history];
        updatedHistory[messageIndex].translations[targetLang] = translatedText;
        setHistory(updatedHistory);
    };

    const handleNewConversation = () => {
        setHistory([]);
        localStorage.removeItem(`chatHistory_${chatId}`);
    };


    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                    <span><i className={`fas ${config.icon} mr-3 text-indigo-600 dark:text-indigo-400`}></i>{title}</span>
                    <i className={`fas fa-chevron-down transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}></i>
                </h2>
                <p className={`text-gray-600 dark:text-slate-400 transition-all duration-300 ${isExpanded ? 'mb-6' : 'mb-0'}`}>{description}</p>
            </div>
            
            {isExpanded && (
                <div className="animate-fade-in">
                    <div ref={chatContainerRef} className="h-80 overflow-y-auto p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg mb-4 border border-gray-200 dark:border-slate-700 space-y-4">
                        {history.map(msg => (
                           <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"><i className="fas fa-robot text-white"></i></div>}
                                <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200'}`}>
                                    <div className="whitespace-pre-wrap">{parseMarkdownLinks(msg.text)}</div>
                                    {msg.role === 'model' && msg.text !== t('iaError') && (
                                       <button onClick={() => handleTranslate(msg.id, language === 'es' ? Language.HE : Language.ES)} className="text-xs mt-2 text-indigo-600 dark:text-indigo-400 hover:underline">
                                           {t('ai_translate_button_text', { lang: t(`language_name_${language === 'es' ? 'he' : 'es'}`) })}
                                       </button>
                                    )}
                                    {msg.translations[language] && (
                                        <div className="mt-2 pt-2 border-t border-gray-300 dark:border-slate-600">
                                            <p className="text-xs italic text-gray-500 dark:text-slate-400 mb-1">{t('ai_translated_from_label', { lang: t(`language_name_${msg.originalLang}`) })}</p>
                                            <p className="whitespace-pre-wrap">{msg.translations[language]}</p>
                                        </div>
                                    )}
                                </div>
                                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0"><i className="fas fa-user text-white"></i></div>}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={placeholder}
                            disabled={isLoading}
                            className="flex-grow p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                        <button onClick={handleSendMessage} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-5 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                        </button>
                        <button onClick={handleNewConversation} title={t('ai_chat_new_conversation')} className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-800 dark:text-gray-100 font-bold py-3 px-4 rounded-lg transition-colors duration-150">
                            <i className="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AIChatBox;