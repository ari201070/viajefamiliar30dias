import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PhotoItem } from '../../types.ts';
import { v4 as uuidv4 } from 'uuid';
import { CITIES } from '../../constants.ts';
import { dbService } from '../../services/dbService.ts';

const FamilyPhotoAlbum: React.FC = () => {
  const { t, language } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [photos, setPhotos] = useState<PhotoItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const getInitialPhotos = useCallback(() => {
    return CITIES.slice(0, 5).map((city, index) => ({
      id: `placeholder-${city.id}`,
      src: city.image,
      caption: t('photo_album_placeholder_caption', { cityName: t(city.nameKey) }),
      originalLang: language,
      cityId: city.id,
      tripDay: index * 5 + 1, // Approximate trip day
      dateTaken: new Date(2025, 8, 26 + index * 5).toISOString().split('T')[0] // Approximate date
    }));
  }, [t, language]);
  
  const loadPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const photosFromDB = await dbService.getPhotos();
      
      const hasSeeded = localStorage.getItem('photosSeeded') === 'true';

      if (photosFromDB.length === 0 && !hasSeeded) {
          const initialPhotos = getInitialPhotos();
          await dbService.addPhotosBatch(initialPhotos);
          setPhotos(initialPhotos);
          localStorage.setItem('photosSeeded', 'true');
      } else {
        setPhotos(photosFromDB);
      }
    } catch (error) {
        console.error("Failed to load photos from IndexedDB", error);
        setPhotos([]); // Set to empty array on error
    } finally {
        setIsLoading(false);
    }
  }, [getInitialPhotos]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const groupedPhotos = useMemo(() => {
    if (!photos) return {};
    const groups: Record<string, PhotoItem[]> = {};
    photos.forEach(photo => {
      const cityId = photo.cityId || 'unclassified';
      if (!groups[cityId]) {
        groups[cityId] = [];
      }
      groups[cityId].push(photo);
    });

    // Sort cities based on CITIES array order, with 'unclassified' at the end
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
        sortedGroups[key] = groups[key];
    });

    return sortedGroups;
  }, [photos]);

  useEffect(() => {
    setOpenSections(prevOpenSections => {
        const newOpenState = { ...prevOpenSections };
        let stateChanged = false;
        Object.keys(groupedPhotos).forEach(cityId => {
            if (newOpenState[cityId] === undefined) {
              newOpenState[cityId] = false; // Default new sections to closed
              stateChanged = true;
            }
        });
        return stateChanged ? newOpenState : prevOpenSections;
    });
  }, [groupedPhotos]);

  const toggleSection = (cityId: string) => {
    setOpenSections(prev => ({ ...prev, [cityId]: !prev[cityId] }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState<Partial<PhotoItem> | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentPhoto({
          id: uuidv4(),
          src: event.target?.result as string,
          caption: '',
          originalLang: language,
          dateTaken: new Date().toISOString().split('T')[0], // Default to today
          tripDay: 1,
          cityId: CITIES[0].id
        });
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
       e.target.value = ''; // Reset input to allow same file upload again
    }
  };

  const handleEditPhoto = (photo: PhotoItem) => {
    setCurrentPhoto(photo);
    setIsModalOpen(true);
  };
  
  const handleSavePhoto = async () => {
    if (!currentPhoto || !currentPhoto.id) return;
    
    try {
        await dbService.savePhoto(currentPhoto as PhotoItem);
        window.dispatchEvent(new Event('storage')); // Trigger cloud sync indicator
        setIsModalOpen(false);
        setCurrentPhoto(null);
        await loadPhotos(); // Reload photos from DB to update UI
    } catch(error) {
        console.error("Failed to save photo", error);
    }
  };

  const handleRemovePhoto = async (id: string) => {
    if (window.confirm(t('photo_album_confirm_delete'))) {
        try {
            await dbService.deletePhoto(id);
            window.dispatchEvent(new Event('storage'));
            await loadPhotos(); // Reload photos from DB
        } catch(error) {
            console.error("Failed to delete photo", error);
        }
    }
  };
  
  const handleModalInputChange = (field: keyof PhotoItem, value: any) => {
    if (currentPhoto) {
      setCurrentPhoto({ ...currentPhoto, [field]: value });
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
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
      </h2>
      <p className="text-gray-600 dark:text-slate-400 mb-6">{t('photo_album_description')}</p>

      {isLoading || photos === null ? (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <i className="fas fa-spinner fa-spin text-4xl mb-4 text-indigo-500"></i>
          <p>{t('loading')}</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <i className="fas fa-images text-5xl mb-4 text-gray-400 dark:text-slate-500"></i>
          <p>{t('photo_album_empty')}</p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(groupedPhotos).map(([cityId, cityPhotos]) => {
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
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
                           <input type="number" id="tripDay" min="1" value={currentPhoto.tripDay || ''} onChange={(e) => handleModalInputChange('tripDay', parseInt(e.target.value, 10))} className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500" />
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
                    <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500">{t('photo_album_cancel_button')}</button>
                    <button onClick={handleSavePhoto} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{t('photo_album_save_button')}</button>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default FamilyPhotoAlbum;