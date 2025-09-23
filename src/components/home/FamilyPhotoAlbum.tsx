import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PhotoItem } from '../../types.ts';
import { v4 as uuidv4 } from 'uuid';
import { CITIES } from '../../constants.ts';
import { firebaseSyncService } from '../../services/firebaseSyncService.ts';
import { isFirebaseConfigured } from '../../services/firebaseConfig.ts';
import { dbService } from '../../services/dbService.ts';


const FamilyPhotoAlbum: React.FC = () => {
  const { t, language, user } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Partial<PhotoItem> | null>(null);

  // --- NEW: State for batch uploads ---
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchPhotos, setBatchPhotos] = useState<Partial<PhotoItem>[]>([]);
  const [batchDetails, setBatchDetails] = useState({
      cityId: CITIES[0].id,
      tripDay: 1,
      dateTaken: new Date().toISOString().split('T')[0],
  });
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    if (user && isFirebaseConfigured) {
      // Use real-time listener for instant sync across devices.
      const unsubscribe = firebaseSyncService.listenToPhotos((fetchedPhotos) => {
        setPhotos(fetchedPhotos);
        setIsLoading(false);
      });
      // Cleanup subscription on component unmount
      return () => unsubscribe();
    } else {
      // Fallback to local IndexedDB if Firebase is not used
      const fetchLocalPhotos = async () => {
        const localPhotos = await dbService.getPhotos();
        setPhotos(localPhotos);
        setIsLoading(false);
      };
      fetchLocalPhotos();
    }
  }, [user]);

  const groupedPhotos = useMemo(() => {
    const groups: Record<string, PhotoItem[]> = {};
    photos.forEach(photo => {
      const cityId = photo.cityId || 'unclassified';
      if (!groups[cityId]) {
        groups[cityId] = [];
      }
      groups[cityId].push(photo);
    });

    const cityOrder = CITIES.map(c => c.id);
    const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
        if (a === 'unclassified') return 1;
        if (b === 'unclassified') return -1;
        const indexA = cityOrder.indexOf(a);
        const indexB = cityOrder.indexOf(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    const sortedGroups: Record<string, PhotoItem[]> = {};
    sortedGroupKeys.forEach(key => {
        sortedGroups[key] = groups[key].sort((a,b) => new Date(b.dateTaken || 0).getTime() - new Date(a.dateTaken || 0).getTime());
    });

    return sortedGroups;
  }, [photos]);

  useEffect(() => {
    setOpenSections(prevOpenSections => {
        const newOpenState = { ...prevOpenSections };
        let stateChanged = false;
        Object.keys(groupedPhotos).forEach(cityId => {
            if (newOpenState[cityId] === undefined) {
              newOpenState[cityId] = true; // Default to open
              stateChanged = true;
            }
        });
        return stateChanged ? newOpenState : prevOpenSections;
    });
  }, [groupedPhotos]);

  const toggleSection = (cityId: string) => {
    setOpenSections(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };
  
  // FIX: Rewrote file upload handler using async/await to improve type safety and resolve compiler errors.
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };
    
    const fileList = Array.from(files);

    if (fileList.length === 1) {
      const src = await readFileAsDataURL(fileList[0]);
      setCurrentPhoto({
        id: uuidv4(),
        src,
        caption: '',
        originalLang: language,
        dateTaken: new Date().toISOString().split('T')[0],
        tripDay: 1,
        cityId: CITIES[0].id
      });
      setIsModalOpen(true);
    } else {
      const photoPromises = fileList.map(async (file) => {
        const src = await readFileAsDataURL(file);
        return {
          id: uuidv4(),
          src,
          caption: '',
          originalLang: language,
        };
      });
      const newBatchPhotos = await Promise.all(photoPromises);
      setBatchPhotos(newBatchPhotos);
      setIsBatchModalOpen(true);
    }
     e.target.value = ''; // Reset file input
  };


  const handleEditPhoto = (photo: PhotoItem) => {
    setCurrentPhoto(photo);
    setIsModalOpen(true);
  };
  
  const handleSavePhoto = async () => {
    if (!currentPhoto || !currentPhoto.id) return;
    
    setIsUploading(true);
    const photoToSave = currentPhoto as PhotoItem;

    if (user && isFirebaseConfigured) {
      // Save to the shared family album. The listener will update the UI.
      await firebaseSyncService.savePhoto(photoToSave);
    } else {
      // Save to local IndexedDB
      await dbService.savePhoto(photoToSave);
      // Manually update local state since there is no listener for offline mode
      const newPhotos = await dbService.getPhotos(); // Re-fetch to get the correctly sorted list
      setPhotos(newPhotos);
    }

    setIsUploading(false);
    setIsModalOpen(false);
    setCurrentPhoto(null);
  };

  const handleRemovePhoto = async (id: string) => {
    if (window.confirm(t('photo_album_confirm_delete'))) {
      if (user && isFirebaseConfigured) {
        // Delete from the shared family album. The listener will update state.
        await firebaseSyncService.deletePhoto(id);
      } else {
        await dbService.deletePhoto(id);
        // Manually update local state
        setPhotos(prevPhotos => prevPhotos.filter(p => p.id !== id));
      }
    }
  };
  
  // FIX: Improved type safety by replacing 'any' with specific types, preventing potential type pollution.
  const handleModalInputChange = (field: keyof PhotoItem, value: string | number | undefined) => {
    if (currentPhoto) {
      setCurrentPhoto({ ...currentPhoto, [field]: value });
    }
  };


  // --- NEW: Handlers for batch modal ---
  const handleBatchDetailsChange = (field: keyof typeof batchDetails, value: any) => {
      setBatchDetails(prev => ({...prev, [field]: value }));
  };

  const handleSaveBatch = async () => {
    setIsUploading(true);
    setUploadMessage(t('photo_album_uploading_many', { count: batchPhotos.length.toString() }));

    const photosToSave: PhotoItem[] = batchPhotos.map(p => ({
      ...p,
      cityId: batchDetails.cityId,
      tripDay: batchDetails.tripDay,
      dateTaken: batchDetails.dateTaken,
    } as PhotoItem));
    
    try {
      if (user && isFirebaseConfigured) {
        // Use the new, more efficient batch function.
        // The real-time listener will update the UI automatically.
        await firebaseSyncService.addPhotosBatch(photosToSave);
      } else {
        // Use batch add for local DB for better performance
        await dbService.addPhotosBatch(photosToSave);
        // Then update the state all at once.
        const newPhotos = await dbService.getPhotos(); // Re-fetch to get the correctly sorted list.
        setPhotos(newPhotos);
      }
    } catch (error) {
        console.error("Failed to save batch photos:", error);
        // Here you could show an error message to the user
    } finally {
      setIsUploading(false);
      setIsBatchModalOpen(false);
      setBatchPhotos([]);
      setUploadMessage('');
    }
  };


  const sectionTitleClasses = "text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 pb-2 border-b-2 border-indigo-500 dark:border-indigo-600";
  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";

  return (
    <section className={cardClasses}>
      <h2 className={`${sectionTitleClasses} flex items-center justify-between`}>
        <div className="flex items-center">
          <i className="fas fa-camera-retro mr-3 text-indigo-600 dark:text-indigo-400"></i>
          {t('photo_album_title')}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 text-sm"
        >
          <i className="fas fa-plus mr-2"></i>{t('photo_album_add_button')}
        </button>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple />
      </h2>
      <p className="text-gray-600 dark:text-slate-400 mb-6">{t('photo_album_description')}</p>

      {isLoading ? (
        <div className="text-center py-16"><i className="fas fa-spinner fa-spin text-4xl text-indigo-500"></i></div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <i className="fas fa-images text-5xl mb-4 text-gray-400 dark:text-slate-500"></i>
          <p>{t('photo_album_empty')}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(groupedPhotos).map(([cityId, cityPhotos]) => {
            if (cityPhotos.length === 0) return null;
            const city = CITIES.find(c => c.id === cityId);
            const sectionTitle = city ? t(city.nameKey) : t('photo_album_unclassified');
            const sectionIsOpen = openSections[cityId] ?? false;
            
            return (
              <div key={cityId}>
                <button
                  onClick={() => toggleSection(cityId)}
                  className="w-full flex justify-between items-center text-left p-3 bg-gray-100 dark:bg-slate-700/50 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                  aria-expanded={sectionIsOpen}
                >
                  <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-400">{sectionTitle} ({cityPhotos.length})</h3>
                  <i className={`fas fa-chevron-down text-indigo-500 transform transition-transform duration-300 ${sectionIsOpen ? 'rotate-180' : ''}`}></i>
                </button>
                
                {sectionIsOpen && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 animate-fade-in">
                    {cityPhotos.map(photo => (
                      <div key={photo.id} className="aspect-square relative group overflow-hidden rounded-lg shadow-md bg-gray-200 dark:bg-slate-700">
                        <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 text-white">
                          <div className="text-xs flex items-center gap-3">
                              {photo.tripDay && <span>{t('photo_album_trip_day')} {photo.tripDay}</span>}
                              {photo.dateTaken && <span>{new Date(photo.dateTaken).toLocaleDateString(language)}</span>}
                          </div>
                          <p className="text-sm mt-1">{photo.caption}</p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button onClick={() => handleEditPhoto(photo)} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-blue-600 hover:bg-white" aria-label={t('photo_album_edit_caption_label')}><i className="fas fa-pencil-alt"></i></button>
                          <button onClick={() => handleRemovePhoto(photo.id)} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-red-600 hover:bg-white" aria-label={t('photo_album_delete_photo_label')}><i className="fas fa-trash"></i></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {isModalOpen && currentPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
                <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">{t('photo_album_add_details_title')}</h3>
                <img src={currentPhoto.src} alt="Preview" className="w-full rounded-md mb-4 max-h-64 object-contain bg-gray-100 dark:bg-slate-700" />
                <div className="space-y-4">
                    <div>
                        <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_city')}</label>
                        <select id="cityId" value={currentPhoto.cityId} onChange={(e) => handleModalInputChange('cityId', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500">
                            {CITIES.map(city => <option key={city.id} value={city.id}>{t(city.nameKey)}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="tripDay" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_trip_day')}</label>
                           {/* FIX: Improved onChange handler to prevent NaN values from being stored. */}
                           <input type="number" id="tripDay" min="1" value={currentPhoto.tripDay || ''} onChange={(e) => {
                                const num = parseInt(e.target.value, 10);
                                handleModalInputChange('tripDay', isNaN(num) ? undefined : num);
                           }} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                        <div>
                           <label htmlFor="dateTaken" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_date_taken')}</label>
                           <input type="date" id="dateTaken" value={currentPhoto.dateTaken || ''} onChange={(e) => handleModalInputChange('dateTaken', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_caption')}</label>
                        <textarea id="caption" rows={3} value={currentPhoto.caption} onChange={(e) => handleModalInputChange('caption', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500" disabled={isUploading}>{t('photo_album_cancel_button')}</button>
                    <button onClick={handleSavePhoto} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={isUploading}>
                      {isUploading ? <i className="fas fa-spinner fa-spin mr-2"></i> : ''}
                      {t('photo_album_save_button')}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* NEW: Batch Upload Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" aria-modal="true" role="dialog">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-2xl m-4 max-h-[90vh] flex flex-col">
                <h3 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">{t('photo_album_add_details_batch_title', {count: batchPhotos.length.toString()})}</h3>
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 mb-4">
                        {batchPhotos.map(photo => (
                            <img key={photo.id} src={photo.src} alt="preview" className="aspect-square w-full object-cover rounded-md bg-gray-100 dark:bg-slate-700"/>
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-slate-200">{t('photo_album_apply_to_all')}</h4>
                        <div className="space-y-4">
                             <div>
                                <label htmlFor="batchCityId" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_city')}</label>
                                <select id="batchCityId" value={batchDetails.cityId} onChange={(e) => handleBatchDetailsChange('cityId', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500">
                                    {CITIES.map(city => <option key={city.id} value={city.id}>{t(city.nameKey)}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                   <label htmlFor="batchTripDay" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_trip_day')}</label>
                                   <input type="number" id="batchTripDay" min="1" value={batchDetails.tripDay} onChange={(e) => handleBatchDetailsChange('tripDay', parseInt(e.target.value, 10))} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                   <label htmlFor="batchDateTaken" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('photo_album_date_taken')}</label>
                                   <input type="date" id="batchDateTaken" value={batchDetails.dateTaken} onChange={(e) => handleBatchDetailsChange('dateTaken', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="mt-6 flex-shrink-0 flex justify-between items-center">
                    <div className="text-sm text-gray-600 dark:text-slate-400">
                      {isUploading ? uploadMessage : ''}
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsBatchModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500" disabled={isUploading}>{t('photo_album_cancel_button')}</button>
                        <button onClick={handleSaveBatch} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={isUploading}>
                          {isUploading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-save mr-2"></i>}
                          {t('photo_album_save_all_button')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default FamilyPhotoAlbum;
