import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PackingItem } from '../../types.ts';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'packingList';

const PackingList: React.FC = () => {
  const { t, language } = useAppContext();
  const [packingItems, setPackingItems] = useState<PackingItem[]>(() => {
    try {
      const savedItems = localStorage.getItem(STORAGE_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Failed to load packing list from localStorage", error);
      return [];
    }
  });
  const [newItemText, setNewItemText] = useState('');
  const [newItemType, setNewItemType] = useState<'essential' | 'optional'>('essential');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(packingItems));
    } catch (error) {
      console.error("Failed to save packing list to localStorage", error);
    }
  }, [packingItems]);


  const handleAddPackingItem = () => {
    if (newItemText.trim() === '') return;
    const newItem: PackingItem = {
      id: uuidv4(),
      text: newItemText.trim(),
      type: newItemType,
      originalLang: language,
    };
    
    setPackingItems(prevItems => [...prevItems, newItem]);
    setNewItemText('');
  };

  const handleRemovePackingItem = (id: string) => {
    setPackingItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";
  
  const renderList = (type: 'essential' | 'optional') => {
    const items = packingItems.filter(item => item.type === type);
    if (items.length === 0) {
      return (
        <div className="text-center py-10 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <i className="fas fa-suitcase-rolling text-4xl mb-3 text-gray-400 dark:text-slate-500"></i>
          <p>{t('packing_list_empty')}</p>
        </div>
      );
    }
    return (
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg shadow-sm group">
            <span className="text-gray-800 dark:text-slate-200 break-all">{item.text}</span>
            <button 
                onClick={() => handleRemovePackingItem(item.id)} 
                className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 ml-4"
                aria-label={`Remove ${item.text}`}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </li>
        ))}
      </ul>
    );
  };
  
  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}>
        <i className="fas fa-suitcase-rolling mr-3 text-indigo-600 dark:text-indigo-400"></i>
        {t('packing_title')}
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddPackingItem()}
          placeholder={t('packing_placeholder')}
          className="flex-grow p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700 dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-slate-500"
        />
        <select
          value={newItemType}
          onChange={(e) => setNewItemType(e.target.value as 'essential' | 'optional')}
          className="p-3 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
        >
          <option value="essential">{t('packing_essential')}</option>
          <option value="optional">{t('packing_optional')}</option>
        </select>
        <button
          onClick={handleAddPackingItem}
          className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          <i className="fas fa-plus mr-2"></i>{t('packing_add')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-3">{t('packing_essential')}</h4>
          {renderList('essential')}
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-700 dark:text-slate-300 mb-3">{t('packing_optional')}</h4>
          {renderList('optional')}
        </div>
      </div>
    </section>
  );
};

export default PackingList;