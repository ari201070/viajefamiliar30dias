import { useState, useEffect, FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PackingItem } from '../../types.ts';

const PackingList: FC = () => {
    const { t, language } = useAppContext();
    const [items, setItems] = useState<PackingItem[]>([]);
    const [newItemText, setNewItemText] = useState('');
    const [newItemType, setNewItemType] = useState<'essential' | 'optional'>('essential');

    useEffect(() => {
        const savedList = localStorage.getItem('packingList');
        if (savedList) {
            setItems(JSON.parse(savedList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('packingList', JSON.stringify(items));
    }, [items]);

    const handleAddItem = () => {
        if (newItemText.trim() === '') return;
        const newItem: PackingItem = {
            id: Date.now().toString(),
            text: newItemText,
            type: newItemType,
            originalLang: language,
            checked: false,
        };
        setItems([...items, newItem]);
        setNewItemText('');
    };

    const toggleItemChecked = (id: string) => {
        setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
    };

    const deleteItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const renderList = (type: 'essential' | 'optional') => {
        const filteredItems = items.filter(item => item.type === type);
        if (filteredItems.length === 0) {
            return <p className="text-sm text-gray-500 dark:text-slate-400 italic">{t('packing_list_empty')}</p>
        }
        return (
            <ul className="space-y-2">
                {filteredItems.map(item => (
                    <li key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-700/50 rounded-md">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={item.checked}
                                onChange={() => toggleItemChecked(item.id)}
                                className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className={`ml-3 ${item.checked ? 'line-through text-gray-500' : 'text-gray-800 dark:text-slate-200'}`}>{item.text}</span>
                        </div>
                        <button onClick={() => deleteItem(item.id)} className="text-red-500 hover:text-red-700">
                            <i className="fas fa-trash-alt"></i>
                        </button>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600 flex items-center">
                <i className="fas fa-suitcase-rolling mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('packing_title')}
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
                <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder={t('packing_placeholder')}
                    className="flex-grow p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700"
                />
                <select value={newItemType} onChange={e => setNewItemType(e.target.value as any)} className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                    <option value="essential">{t('packing_essential')}</option>
                    <option value="optional">{t('packing_optional')}</option>
                </select>
                <button onClick={handleAddItem} className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg">
                    {t('packing_add')}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-slate-300">{t('packing_essential')}</h3>
                    {renderList('essential')}
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-slate-300">{t('packing_optional')}</h3>
                    {renderList('optional')}
                </div>
            </div>
        </section>
    );
};

export default PackingList;