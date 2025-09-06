
import React, { useState } from 'react';
import { useAppContext } from '../App.tsx';
import AIChatBox from './AIChatBox.tsx';

const AIChatFab: React.FC = () => {
  const { t } = useAppContext();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-8 right-24 z-50 bg-indigo-600 text-white p-0 w-14 h-14 rounded-full shadow-lg hover:bg-indigo-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-900 transition-all duration-300 ease-in-out flex items-center justify-center"
        aria-label={t('open_chat')}
      >
        <i className={`fas ${isChatOpen ? 'fa-times' : 'fa-comments'} text-2xl`}></i>
      </button>
      {isChatOpen && <AIChatBox closeChat={() => setIsChatOpen(false)} />}
    </>
  );
};

export default AIChatFab;
