import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Changed import path for useAppContext to the correct context file.
import { useAppContext } from '../context/AppContext.tsx';
import { AIPromptContent, City, ChatMessage, Language } from '../types.ts';
import { sendMessageInChat, translateText } from '../services/apiService.ts';
import { v4 as uuidv4 } from 'uuid';
import { stripMarkdown } from '../utils/markdownParser.ts';

interface AIChatBoxProps {
  config: AIPromptContent;
  // FIX: Made city optional and added chatId to support general (non-city-specific) chat instances.
  city?: City;
  chatId: string;
}

// Check for browser support for Web Speech API
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const isSpeechSupported = SpeechRecognition && window.speechSynthesis;


const AIChatBox: React.FC<AIChatBoxProps> = ({ config, city, chatId }) => {
  const { t, language } = useAppContext();
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  // FIX: Used the new chatId prop to create a unique storage key.
  const storageKey = `chatHistory_${chatId}`;

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
  const [isRecording, setIsRecording] = useState(false);
  const [translatingId, setTranslatingId] = useState<string | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const handleNewConversation = () => {
    if (speakingMessageId) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
    }
    if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    }
    setMessages([]);
  };

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
  
  useEffect(() => {
    const loadVoices = () => {
      if (isSpeechSupported) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    if (isSpeechSupported) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      loadVoices(); // Initial call
    }
    return () => {
      if (isSpeechSupported) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, []);

  // --- Speech Recognition (Voice Input) Logic ---
  const setupRecognition = useCallback(() => {
    if (!isSpeechSupported) return;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language === Language.HE ? 'he-IL' : 'es-AR';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setUserInput(finalTranscript + interimTranscript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [language]);

  useEffect(() => {
    setupRecognition();
  }, [setupRecognition]);

  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };


  // --- Speech Synthesis (Text to Voice) Logic ---
  const handleSpeak = (message: ChatMessage) => {
    if (speakingMessageId === message.id) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
        return;
    }
    const rawText = message.translations?.[language] || message.text;
    const textToSpeak = stripMarkdown(rawText);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // --- Voice Selection Logic ---
    if (language === Language.HE) {
        utterance.lang = 'he-IL';
        const hebrewVoice = voices.find(voice => voice.lang === 'he-IL');
        if (hebrewVoice) utterance.voice = hebrewVoice;
    } else { // Spanish
        utterance.lang = 'es-AR'; // Set desired language tag
        
        // Find the best available voice with a fallback strategy
        const argentinianVoice = voices.find(voice => voice.lang === 'es-AR');
        const latinAmericanVoice = voices.find(voice => voice.lang.startsWith('es-') && voice.lang !== 'es-ES' && voice.lang !== 'es-US');
        const anySpanishVoice = voices.find(voice => voice.lang.startsWith('es-'));

        utterance.voice = argentinianVoice || latinAmericanVoice || anySpanishVoice || null;
    }
    // --- End Voice Selection ---

    utterance.onstart = () => setSpeakingMessageId(message.id);
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    window.speechSynthesis.cancel(); // Stop any previous speech
    window.speechSynthesis.speak(utterance);
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (trimmedInput === '' || isLoading) return;

    if (isRecording) {
        recognitionRef.current?.stop();
        setIsRecording(false);
    }
    if (speakingMessageId) {
        window.speechSynthesis.cancel();
        setSpeakingMessageId(null);
    }

    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      text: trimmedInput,
      originalLang: language,
      translations: {},
    };
    
    // FIX: Capture the history *before* updating the state to ensure the correct context is sent to the API.
    const historyForAPI = [...messages];
    
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    let systemInstruction: string;

    // Refined logic: Special handling for budget analysis to inject dynamic data
    if (city && config.promptKeySuffix === '_ai_prompt_budget_analysis') {
        const perDayText = t('budget_per_day_suffix');
        const budgetData = city.budgetItems
            .map(item => `- ${t(item.conceptKey)}: ${item.value} USD ${item.isPerDay ? perDayText : ''}`.trim())
            .join('\n');
        
        const promptTemplateKey = `generic${config.promptKeySuffix}`; // Use generic as the template
        const promptTemplate = t(promptTemplateKey);
        
        systemInstruction = promptTemplate
            .replace('{cityName}', t(city.nameKey))
            .replace('{budgetData}', budgetData);
            
    } else if (city) { // Logic for other city-specific chats
        const basePromptKey = `${city.id}${config.promptKeySuffix}`;
        systemInstruction = t(basePromptKey, { cityName: t(city.nameKey) });
        if (systemInstruction === basePromptKey) {
            // Fallback to generic prompt if specific one doesn't exist
            const genericPromptKey = `generic${basePromptKey.substring(city.id.length)}`;
            systemInstruction = t(genericPromptKey, { cityName: t(city.nameKey) });
        }
    } else { // Handle general AI chat on homepage (no city)
        const promptKey = config.promptKeySuffix.replace(/^_/, '');
        systemInstruction = t(promptKey);
    }


    try {
      const responseText = await sendMessageInChat(systemInstruction, historyForAPI, trimmedInput, language);
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
  
  const handleTranslate = useCallback(async (messageId: string) => {
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
  }, [messages, language]);
  
  useEffect(() => {
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    if (!isLoading && lastMessage && lastMessage.role === 'model' && lastMessage.originalLang !== language && !lastMessage.translations?.[language]) {
        handleTranslate(lastMessage.id);
    }
  }, [language, messages, isLoading, handleTranslate]);

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg dark:shadow-slate-700/50 hover:shadow-xl dark:hover:shadow-slate-700 transition-shadow duration-300 ease-in-out flex flex-col";
  const sectionTitleClasses = "text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4 pb-2 border-b border-indigo-200 dark:border-slate-600 flex items-center";
  const detailTextClasses = "text-gray-700 dark:text-slate-300 leading-relaxed";

  return (
    <section className={cardClasses} style={{ minHeight: '500px' }}>
      <h2 className={`${sectionTitleClasses} justify-between`}>
        <div className="flex items-center">
          <i className={`fas ${config.icon} mr-3 text-xl text-indigo-500 dark:text-indigo-400`}></i>
          {t(config.titleKey)}
        </div>
        <button
            onClick={handleNewConversation}
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors ml-4 whitespace-nowrap flex-shrink-0"
            aria-label={t('ai_chat_new_conversation')}
        >
            <i className="fas fa-sync-alt mr-2"></i>
            {t('ai_chat_new_conversation')}
        </button>
      </h2>
      <p className={`${detailTextClasses} mb-4 flex-shrink-0`}>
        {/* FIX: Conditionally render description text to avoid errors when city is not present. */}
        {city ? t(config.descriptionKey, { cityName: t(city.nameKey) }) : t(config.descriptionKey)}
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
              <div className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full`}>
                {msg.role === 'model' && isSpeechSupported && (
                    <button 
                        onClick={() => handleSpeak(msg)}
                        className={`text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mt-2 ${speakingMessageId === msg.id ? 'text-indigo-600' : ''}`}
                        aria-label={speakingMessageId === msg.id ? 'Stop speaking' : 'Speak message'}
                    >
                        <i className={`fas ${speakingMessageId === msg.id ? 'fa-stop-circle' : 'fa-volume-up'}`}></i>
                    </button>
                )}
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
                    className="mt-1.5 ml-8 text-xs text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-50 disabled:cursor-wait"
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
        {isSpeechSupported && (
          <button
            type="button"
            onClick={handleToggleRecording}
            className={`transition-colors text-white font-semibold py-3 px-5 rounded-lg shadow-md h-[50px] w-[60px] flex items-center justify-center ${
              isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-sky-500 hover:bg-sky-600'
            }`}
            aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <i className={`fas ${isRecording ? 'fa-stop' : 'fa-microphone-alt'} text-xl`}></i>
          </button>
        )}
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