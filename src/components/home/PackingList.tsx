import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PackingItem } from '../../types.ts';
import { v4 as uuidv4 } from 'uuid';
import { firebaseSyncService } from '../../services/firebaseSyncService.ts';
import { isFirebaseConfigured } from '../../services/firebaseConfig.ts';

const PackingList: React.FC = () => {
  const { t, language, user } = useAppContext();
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemText, setNewItemText] = useState('');
  const [newItemType, setNewItemType] = useState<'essential' | 'optional'>('essential');

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    if (user && isFirebaseConfigured) {
        const items = await firebaseSyncService.getPackingList(user.uid);
        setPackingItems(items);
    } else {
        try {
            const saved = localStorage.getItem('packingList');
            setPackingItems(saved ? JSON.parse(saved) : []);
        } catch (e) {
            console.error("Failed to load packing list from localStorage", e);
            setPackingItems([]);
        }
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);
  
  const saveList = useCallback(async (items: PackingItem[]) => {
      if (user && isFirebaseConfigured) {
        await firebaseSyncService.savePackingList(user.uid, items);
      } else {
        try {
            localStorage.setItem('packingList', JSON.stringify(items));
        } catch (e) {
            console.error("Failed to save packing list to localStorage", e);
        }
      }
  }, [user]);

  const handleAddPackingItem = () => {
    if (newItemText.trim() === '') return;
    const newItem: PackingItem = {
      id: uuidv4(),
      text: newItemText.trim(),
      type: newItemType,
      originalLang: language,
      checked: false,
    };
    
    const updatedItems = [...packingItems, newItem];
    setPackingItems(updatedItems);
    saveList(updatedItems);
    setNewItemText('');
  };

  const handleRemovePackingItem = (id: string) => {
    const updatedItems = packingItems.filter(item => item.id !== id);
    setPackingItems(updatedItems);
    saveList(updatedItems);
  };
  
  const handleTogglePackingItem = (id: string) => {
    const updatedItems = packingItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
    );
    setPackingItems(updatedItems);
    saveList(updatedItems);
  };
  
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  const renderList = (type: 'essential' | 'optional') => {
    if (isLoading) {
      return (
        <div className="text-center py-10 text-gray-500 dark:text-slate-400">
          <i className="fas fa-spinner fa-spin text-3xl"></i>
        </div>
      );
    }
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
          <li
            key={item.id}
            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg shadow-sm group transition-all duration-300"
          >
            <div
              className="flex items-center flex-grow cursor-pointer"
              onClick={() => handleTogglePackingItem(item.id)}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => handleTogglePackingItem(item.id)}
                className="h-5 w-5 rounded border-gray-400 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-600 dark:checked:bg-indigo-500 dark:checked:border-indigo-500 mr-4 flex-shrink-0"
                aria-labelledby={`item-text-${item.id}`}
              />
              <span
                id={`item-text-${item.id}`}
                className={`text-gray-800 dark:text-slate-200 break-all transition-all ${
                  item.checked ? 'line-through text-gray-400 dark:text-slate-500' : ''
                }`}
              >
                {item.text}
              </span>
            </div>
            <button
              onClick={() => handleRemovePackingItem(item.id)}
              className="text-red-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100 ml-4 flex-shrink-0"
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