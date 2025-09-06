import React, { useState } from 'react';
import { useAppContext } from '../../App.tsx';
import { askGemini, translateText } from '../../services/apiService.ts';

// Define the structure for the AI response state
interface AIResponseState {
  original: string;
  translated: string | null;
}

const GeneralAIQuery: React.FC = () => {
  const { t, language } = useAppContext();
  const [aiQuestion, setAiQuestion] = useState('');
  // Use the new state structure
  const [aiResponse, setAiResponse] = useState<AIResponseState | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  // State to handle the translation loading state
  const [isTranslating, setIsTranslating] = useState(false);
  
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  const handleAskAi = async () => {
    if (aiQuestion.trim() === '') return;
    setIsAiLoading(true);
    setAiResponse(null); // Reset the entire response object
    try {
      // Always get the response in the base language (Spanish)
      const baseResponse = await askGemini(aiQuestion, 'es');
      // Set the response with original text, leaving translated as null
      setAiResponse({ original: baseResponse, translated: null });
    } catch (error) {
      // On error, still set an object to be consistent
      setAiResponse({ original: t('iaError'), translated: null });
    } finally {
      setIsAiLoading(false);
    }
  };

  // Function to handle the translation, mirroring the logic from AIChatBox.tsx
  const handleTranslate = async () => {
    if (!aiResponse || !aiResponse.original || isTranslating) return;

    setIsTranslating(true);
    try {
      const translatedText = await translateText(aiResponse.original, language);
      // Update the state with the translated text
      setAiResponse(prev => prev ? { ...prev, translated: translatedText } : null);
    } catch (error) {
      console.error("Translation failed:", error);
      // Optionally, set a translation error message
      setAiResponse(prev => prev ? { ...prev, translated: t('translation_error') } : null);
    } finally {
      setIsTranslating(false);
    }
  };


  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}><i className="fas fa-robot mr-3 text-indigo-600 dark:text-indigo-400"></i>{t('iaTitulo')}</h2>
      <textarea
        value={aiQuestion}
        onChange={(e) => setAiQuestion(e.target.value)}
        placeholder={t('iaPlaceholder')}
        rows={4}
        className="w-full p-3 mb-4 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 placeholder:text-gray-400 dark:placeholder:text-slate-500"
        disabled={isAiLoading}
      />
      <button
        onClick={handleAskAi}
        disabled={isAiLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAiLoading ? <><i className="fas fa-spinner fa-spin mr-2"></i>{t('iaProcessing')}</> : <><i className="fas fa-paper-plane mr-2"></i>{t('consultarBtn')}</> }
      </button>
      
      {/* Display area for AI response */}
      {aiResponse && aiResponse.original && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg shadow whitespace-pre-wrap text-gray-700 dark:text-slate-300">
          {/* Always show the original response */}
          <div dangerouslySetInnerHTML={{ __html: aiResponse.original.replace(/\n/g, '<br />') }} />

          {/* Show the translate button if needed */}
          {language === 'he' && !aiResponse.translated && (
            <div className="mt-2 text-right">
              <button 
                onClick={handleTranslate} 
                disabled={isTranslating}
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 disabled:opacity-50 flex items-center justify-end"
              >
                {isTranslating ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-1.5"></i>
                    {t('translating')}
                  </>
                ) : (
                  <>
                    <img src="/google-ad-services.svg" className="w-4 h-4 mr-1.5" alt="Google AD"/>
                    {t('translate_to_hebrew')}
                  </>
                )}
              </button>
            </div>
          )}

          {/* Show the translated text once available */}
          {aiResponse.translated && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-600">
              <div dangerouslySetInnerHTML={{ __html: aiResponse.translated.replace(/\n/g, '<br />') }} />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default GeneralAIQuery;
