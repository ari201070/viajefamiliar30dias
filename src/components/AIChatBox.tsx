
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../App.tsx';
import { Message } from '../types.ts';
import { sendMessageInChat } from '../services/apiService.ts'; // This function will call our Firebase function
import { marked } from 'marked';

interface AIChatBoxProps {
  closeChat: () => void;
}

const AIChatBox: React.FC<AIChatBoxProps> = ({ closeChat }) => {
  const { t } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const systemInstruction = t('chat_system_prompt');

  const handleSendMessage = async () => {
    if (userInput.trim() === '' || isLoading) return;

    const newUserMessage: Message = { role: 'user', text: userInput };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({ role: msg.role, text: msg.text }));
      const aiResponseText = await sendMessageInChat(systemInstruction, history, userInput);
      
      const aiMessage: Message = { role: 'model', text: aiResponseText };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { role: 'model', text: t('chat_error') };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 h-[60vh] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col z-50 border-2 border-indigo-600 dark:border-indigo-500"> 
      {/* Header */}
      <div className="p-4 bg-indigo-600 dark:bg-indigo-700 text-white rounded-t-lg flex justify-between items-center"> 
        <h3 className="font-bold text-lg">{t('chat_header')}</h3>
        <button onClick={closeChat} aria-label={t('close_chat')} className="hover:text-gray-300">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`p-3 rounded-lg max-w-xs lg:max-w-sm xl:max-w-md ${msg.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200'}`}
                    dangerouslySetInnerHTML={{ __html: marked(msg.text) }}
                />
            </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-slate-200">
                    <i className="fas fa-spinner fa-spin"></i> {t('chat_loading')}
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-700"> 
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={t('chat_placeholder')}
            className="flex-1 p-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-indigo-600 text-white p-2 rounded-lg disabled:bg-indigo-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 flex items-center justify-center w-12 h-10"
          >
            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatBox;
