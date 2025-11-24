import { useState, useEffect, useRef, FC } from 'react';
import { useAppContext } from '../context/AppContext.tsx';
import { AIPromptContent, City, ChatMessage, Language } from '../types.ts';
import { sendMessageInChat, translateText } from '../services/apiService.ts';
import { parseMarkdownLinks } from '../utils/markdownParser.tsx';

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
        if (message.translations[targetLang]) return;

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
                <>
                    <div
                        ref={chatContainerRef}
                        className="bg-gray-50 dark:bg-slate-900 rounded-lg p-4 h-96 overflow-y-auto mb-4 border border-gray-200 dark:border-slate-700"
                    >
                        {history.length === 0 && (
                            <p className="text-center text-gray-400 dark:text-slate-500 italic mt-32">
                                {t('ai_chat_empty_state')}
                            </p>
                        )}
                        {history.map((msg) => (
                            <div key={msg.id} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-3 rounded-lg max-w-[80%] ${msg.role === 'user'
                                    ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-900 dark:text-indigo-100 rounded-br-none'
                                    : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 border border-gray-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                                    }`}>
                                    {(() => {
                                        const translationInCurrentLang = msg.translations?.[language];
                                        const isOriginalInCurrentLang = msg.originalLang === language;

                                        const textToShow = translationInCurrentLang || msg.text;
                                        const isShowingTranslation = !!translationInCurrentLang;

                                        return (
                                            <div>
                                                <div className="markdown-content text-sm sm:text-base">
                                                    {parseMarkdownLinks(textToShow)}
                                                </div>

                                                {isShowingTranslation && (
                                                    <p className="text-xs mt-2 opacity-70 italic flex items-center gap-1">
                                                        <i className="fas fa-language"></i>
                                                        {t('ai_translated_from_label', { lang: t(`language_name_${msg.originalLang}`) })}
                                                    </p>
                                                )}

                                                {!isShowingTranslation && !isOriginalInCurrentLang && (
                                                    <button
                                                        onClick={() => handleTranslate(msg.id, language)}
                                                        className="text-xs mt-2 underline opacity-80 hover:opacity-100 flex items-center gap-1"
                                                    >
                                                        <i className="fas fa-globe"></i>
                                                        {t('ai_translate_button_text', { lang: t(`language_name_${language}`) })}
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
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
                </>
            )}
        </section>
    );
};

export default AIChatBox;