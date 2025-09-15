import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { v4 as uuidv4 } from 'uuid';

const ESSENTIAL_ITEMS_KEYS = [
  'packing_item_passport',
  'packing_item_adapter',
  'packing_item_sunscreen',
  'packing_item_sunglasses',
  'packing_item_hat',
  'packing_item_meds',
  'packing_item_jacket',
  'packing_item_shoes',
];

interface CustomItem {
  id: string;
  text: string;
}

const PackingList: React.FC = () => {
  const { t } = useAppContext();
  const storageKey = 'packingList_customItems_v2';

  const [customItems, setCustomItems] = useState<CustomItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load packing list from localStorage", e);
      return [];
    }
  });

  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(customItems));
    } catch (e) {
      console.error("Failed to save packing list to localStorage", e);
    }
  }, [customItems]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedItem = newItem.trim();
    if (trimmedItem && !customItems.some(item => item.text === trimmedItem)) {
      setCustomItems(prev => [...prev, { id: uuidv4(), text: trimmedItem }]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (idToRemove: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== idToRemove));
  };

  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover-shadow-slate-700 transition-shadow duration-300";

  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}>
        <i className="fas fa-suitcase-rolling mr-3 text-indigo-600 dark:text-indigo-400"></i>
        {t('packing_title')}
      </h2>
      
      <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={t('packing_placeholder')}
          className="flex-grow p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
          aria-label={t('packing_placeholder')}
        />
        <button 
          type="submit" 
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" 
          disabled={!newItem.trim()}
        >
          <i className="fas fa-plus mr-2"></i>{t('packing_add')}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">{t('packing_essential')}</h3>
          <ul className="space-y-3">
            {ESSENTIAL_ITEMS_KEYS.map(key => (
              <li key={key} className="flex items-center bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-sm">
                <i className="fas fa-check-circle text-green-500 dark:text-green-400 mr-3 text-lg"></i>
                <span className="text-gray-800 dark:text-slate-200">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-4">{t('packing_optional')}</h3>
          {customItems.length > 0 ? (
            <ul className="space-y-3">
              {customItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg shadow-sm group">
                  <div className="flex items-center">
                    <i className="fas fa-user-check text-indigo-500 dark:text-indigo-400 mr-3 text-lg"></i>
                    <span className="text-gray-800 dark:text-slate-200 break-all">{item.text}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveItem(item.id)} 
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-4" 
                    aria-label={`Remove ${item.text}`}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 dark:text-slate-400 italic bg-gray-50 dark:bg-slate-700/50 p-6 rounded-lg">
              <i className="fas fa-box-open fa-2x mb-3"></i>
              <p>{t('packing_list_empty')}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PackingList;
