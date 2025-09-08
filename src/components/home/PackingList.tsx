import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../App.tsx';
import { PackingItem } from '../../types.ts';
import { PACKING_LIST_ITEMS } from '../../constants.ts';

const STORAGE_KEY = 'packingListCheckedItems';

const PackingList: React.FC = () => {
  const { t, language } = useAppContext();
  
  // Initialize items with unique IDs and translated text
  const listItems = useMemo((): PackingItem[] => {
    return PACKING_LIST_ITEMS.map(item => ({
      ...item,
      id: item.textKey, // Use textKey as a stable ID
      text: t(item.textKey)
    }));
  }, [t]);

  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(checkedItems)));
    } catch (e) {
      console.error("Failed to save checked items to localStorage", e);
    }
  }, [checkedItems]);

  const handleToggleCheck = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const essentials = listItems.filter(item => item.type === 'essential');
  const optionals = listItems.filter(item => item.type === 'optional');
  
  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  const renderList = (items: PackingItem[], titleKey: string, icon: string) => (
    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
      <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 mb-3 flex items-center">
        <i className={`fas ${icon} mr-3`}></i>
        {t(titleKey)}
      </h3>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id} className="flex items-center">
            <label className="flex items-center cursor-pointer text-gray-700 dark:text-slate-300 w-full">
              <input
                type="checkbox"
                checked={checkedItems.has(item.id)}
                onChange={() => handleToggleCheck(item.id)}
                className="form-checkbox h-5 w-5 text-indigo-600 dark:text-indigo-500 bg-gray-200 dark:bg-slate-600 border-gray-300 dark:border-slate-500 rounded focus:ring-indigo-500 transition-colors"
              />
              <span className={`ml-3 ${language === 'he' ? 'mr-3 ml-0' : ''} ${checkedItems.has(item.id) ? 'line-through text-gray-400 dark:text-slate-500' : ''}`}>
                {item.text}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center`}>
        <i className="fas fa-suitcase-rolling mr-3 text-indigo-600 dark:text-indigo-400"></i>
        {t('packing_list_title')}
      </h2>
      <p className="text-gray-600 dark:text-slate-400 mb-6">{t('packing_list_desc')}</p>
      <div className="space-y-6">
        {renderList(essentials, 'packing_list_essentials', 'fa-check-circle')}
        {renderList(optionals, 'packing_list_optionals', 'fa-star')}
      </div>
    </section>
  );
};

export default PackingList;
