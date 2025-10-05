import React, { useState, useEffect, useRef, FC } from 'react';
import { useAppContext } from '../../context/AppContext.ts';
import { PhotoItem, Language } from '../../types.ts';
import { CITIES } from '../../constants.ts';
import { dbService } from '../../services/dbService.ts'; // Using local DB for now

const FamilyPhotoAlbum: FC = () => {
    const { t, language } = useAppContext();
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [photoDetails, setPhotoDetails] = useState<Partial<PhotoItem>[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const loadPhotos = async () => {
            setIsLoading(true);
            const loadedPhotos = await dbService.getPhotos();
            setPhotos(loadedPhotos);
            setIsLoading(false);
        };
        loadPhotos();
    }, []);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setSelectedFiles(files);
            setPhotoDetails(files.map(() => ({ cityId: CITIES[0].id, tripDay: 1, dateTaken: new Date().toISOString().split('T')[0] })));
            setIsModalOpen(true);
        }
    };
    
    const handleDetailChange = (index: number, field: keyof PhotoItem, value: any) => {
        const newDetails = [...photoDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setPhotoDetails(newDetails);
    };

    const applyToAll = () => {
        const firstDetails = photoDetails[0];
        setPhotoDetails(photoDetails.map(() => ({...firstDetails})));
    };

    const handleSavePhotos = async () => {
        setIsLoading(true);
        const newPhotos: PhotoItem[] = await Promise.all(selectedFiles.map((file, index) => {
            // FIX: Correctly typed the Promise to resolve with `PhotoItem`, satisfying the type requirements for `Promise.all`.
            return new Promise<PhotoItem>((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const newPhoto: PhotoItem = {
                        id: `${Date.now()}-${index}`,
                        src: e.target?.result as string,
                        caption: photoDetails[index]?.caption || '',
                        originalLang: language,
                        dateTaken: photoDetails[index]?.dateTaken || new Date().toISOString(),
                        tripDay: photoDetails[index]?.tripDay || 1,
                        cityId: photoDetails[index]?.cityId || 'unclassified',
                    };
                    resolve(newPhoto);
                };
                reader.readAsDataURL(file);
            });
        }));

        await dbService.addPhotosBatch(newPhotos);
        const allPhotos = await dbService.getPhotos();
        setPhotos(allPhotos);

        setIsModalOpen(false);
        setSelectedFiles([]);
        setPhotoDetails([]);
        setIsLoading(false);
    };
    
    const handleDeletePhoto = async (id: string) => {
        if(window.confirm(t('photo_album_confirm_delete'))) {
            await dbService.deletePhoto(id);
            setPhotos(photos.filter(p => p.id !== id));
        }
    };

    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-2 flex items-center">
                 <i className="fas fa-camera-retro mr-3 text-indigo-600 dark:text-indigo-400" />
                {t('photo_album_title')}
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">{t('photo_album_description')}</p>
            
            <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-md mb-6"
            >
                <i className="fas fa-plus-circle mr-2"></i>{t('photo_album_add_button')}
            </button>
            <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
            />

            {isLoading && <div className="text-center p-8"><i className="fas fa-spinner fa-spin text-3xl text-indigo-500"></i></div>}
            
            {!isLoading && photos.length === 0 && (
                <p className="text-center text-gray-500 dark:text-slate-400 py-8">{t('photo_album_empty')}</p>
            )}

            {!isLoading && photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {photos.map(photo => (
                        <div key={photo.id} className="group relative rounded-lg overflow-hidden shadow-lg">
                            <img src={photo.src} alt={photo.caption} className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex flex-col justify-end p-3">
                                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">{photo.caption}</p>
                                <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-2 right-2 text-white opacity-0 group-hover:opacity-100 bg-red-600/70 rounded-full w-7 h-7 flex items-center justify-center">
                                    <i className="fas fa-trash-alt fa-xs"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{t(selectedFiles.length > 1 ? 'photo_album_add_details_batch_title' : 'photo_album_add_details_title', {count: selectedFiles.length})}</h3>
                        
                        {selectedFiles.length > 1 && (
                            <button onClick={applyToAll} className="mb-4 text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 py-1 px-3 rounded-full">{t('photo_album_apply_to_all')}</button>
                        )}

                        <div className="space-y-4">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="flex flex-col md:flex-row gap-4 p-3 border dark:border-slate-700 rounded-md">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-24 h-24 object-cover rounded-md flex-shrink-0"/>
                                    <div className="flex-grow space-y-2">
                                        <input type="text" placeholder={t('photo_album_caption')} value={photoDetails[index]?.caption || ''} onChange={e => handleDetailChange(index, 'caption', e.target.value)} className="w-full p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700"/>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                             <select value={photoDetails[index]?.cityId} onChange={e => handleDetailChange(index, 'cityId', e.target.value)} className="w-full p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700">
                                                {CITIES.map(c => <option key={c.id} value={c.id}>{t(c.nameKey)}</option>)}
                                                <option value="unclassified">{t('photo_album_unclassified')}</option>
                                            </select>
                                            <input type="number" placeholder={t('photo_album_trip_day')} value={photoDetails[index]?.tripDay || ''} onChange={e => handleDetailChange(index, 'tripDay', parseInt(e.target.value))} className="w-full p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700" min="1" max="32"/>
                                            <input type="date" value={photoDetails[index]?.dateTaken || ''} onChange={e => handleDetailChange(index, 'dateTaken', e.target.value)} className="w-full p-2 border dark:border-slate-600 rounded bg-white dark:bg-slate-700"/>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 dark:bg-slate-600 px-4 py-2 rounded">{t('photo_album_cancel_button')}</button>
                            <button onClick={handleSavePhotos} className="bg-green-500 text-white px-4 py-2 rounded">{t(selectedFiles.length > 1 ? 'photo_album_save_all_button' : 'photo_album_save_button')}</button>
                        </div>
                    </div>
                 </div>
            )}
        </section>
    );
};

export default FamilyPhotoAlbum;