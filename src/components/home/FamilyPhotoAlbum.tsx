import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../../App.tsx';
import { Photo } from '../../types.ts';
import { CITIES } from '../../constants.ts';

const MAX_IMAGE_WIDTH = 1024;
const IMAGE_QUALITY = 0.85;
const LOCAL_STORAGE_KEY = 'familyPhotoAlbum';

// Helper function to resize and compress images before storing
const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let scaleFactor = 1;
        if (img.width > MAX_IMAGE_WIDTH) {
            scaleFactor = MAX_IMAGE_WIDTH / img.width;
        }
        canvas.width = img.width * scaleFactor;
        canvas.height = img.height * scaleFactor;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

const FamilyPhotoAlbum: React.FC = () => {
  const { t, language } = useAppContext();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // Modal form state
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [currentLightboxGroup, setCurrentLightboxGroup] = useState<Photo[]>([]);

  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPhotos) {
        setPhotos(JSON.parse(savedPhotos));
      }
    } catch (error) {
      console.error('Failed to load photos from local storage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(photos));
    } catch (error) {
      console.error('Failed to save photos to local storage', error);
    }
  }, [photos]);
  
  const handleUpload = async () => {
    if (!selectedCityId || !selectedDay || !selectedFiles || selectedFiles.length === 0 || !selectedDate) {
      return;
    }
    setIsUploading(true);

    const newPhotosPromises = Array.from(selectedFiles).map(async (file) => {
      const imageDataUrl = await processImage(file);
      return {
        id: uuidv4(),
        cityId: selectedCityId,
        day: parseInt(selectedDay, 10),
        uploadDate: selectedDate,
        imageDataUrl,
      };
    });

    const newPhotos = await Promise.all(newPhotosPromises);
    setPhotos(prev => [...prev, ...newPhotos].sort((a,b) => a.day - b.day));

    // Reset form and close modal
    setIsUploading(false);
    setIsModalOpen(false);
    setSelectedCityId('');
    setSelectedDay('');
    setSelectedFiles(null);
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };
  
  const handleDelete = (e: React.MouseEvent, photoId: string) => {
    e.stopPropagation(); // Prevent the lightbox from opening.
    if (window.confirm(t('family_photo_album_delete_confirm'))) {
        setPhotos(photos.filter(p => p.id !== photoId));
    }
  };

  const openLightbox = (photo: Photo, group: Photo[]) => {
      setCurrentLightboxGroup(group);
      setLightboxIndex(group.findIndex(p => p.id === photo.id));
  };
  
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = () => setLightboxIndex(prev => (prev! + 1) % currentLightboxGroup.length);
  const prevImage = () => setLightboxIndex(prev => (prev! - 1 + currentLightboxGroup.length) % currentLightboxGroup.length);

  const groupedPhotos = useMemo(() => {
    return photos.reduce((acc, photo) => {
      (acc[photo.cityId] = acc[photo.cityId] || []).push(photo);
      return acc;
    }, {} as Record<string, Photo[]>);
  }, [photos]);

  const cardClasses = "bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50 hover:shadow-2xl dark:hover:shadow-slate-700 transition-shadow duration-300";
  
  return (
    <>
      <section className={cardClasses}>
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 pb-2 border-b-2 border-indigo-500 flex items-center">
                <i className="fas fa-images mr-3 text-indigo-600 dark:text-indigo-400"></i>
                {t('family_photo_album_title')}
            </h2>
            <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
                <i className="fas fa-upload mr-2"></i>
                {t('family_photo_album_upload_btn')}
            </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-700/50 p-3 rounded-lg mb-6 flex items-center"><i className="fas fa-info-circle mr-2 text-gray-400 dark:text-slate-500"></i>{t('family_photo_album_notice')}</p>

        {Object.keys(groupedPhotos).length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-500 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
            <i className="fas fa-camera-retro text-5xl mb-4 text-gray-400 dark:text-slate-600"></i>
            <p>{t('family_photo_album_empty')}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPhotos).sort(([cityIdA], [cityIdB]) => t(CITIES.find(c=>c.id === cityIdA)?.nameKey || '') > t(CITIES.find(c=>c.id === cityIdB)?.nameKey || '') ? 1 : -1).map(([cityId, cityPhotos]) => {
              const city = CITIES.find(c => c.id === cityId);
              return (
                <details key={cityId} open className="group bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
                  <summary className="text-xl font-semibold text-indigo-700 dark:text-indigo-400 cursor-pointer list-none flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors">
                      <span>{t('family_photo_album_photos_in', { cityName: city ? t(city.nameKey) : cityId })}</span>
                      <i className="fas fa-chevron-down transform group-open:rotate-180 transition-transform"></i>
                  </summary>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                    {cityPhotos.sort((a,b) => a.day - b.day).map(photo => (
                      <div key={photo.id} className="relative group aspect-square">
                        <img 
                          src={photo.imageDataUrl} 
                          alt={`${t('family_photo_album_day_prefix', {day: String(photo.day)})}`}
                          className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer transition-transform transform group-hover:scale-105"
                          onClick={() => openLightbox(photo, cityPhotos)}
                          loading="lazy"
                        />
                         <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center rounded-lg">
                           <button onClick={(e) => handleDelete(e, photo.id)} className="absolute top-1.5 right-1.5 text-white bg-red-600 bg-opacity-70 rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-700 transition-all text-xs" aria-label="Delete photo">
                             <i className="fas fa-times"></i>
                           </button>
                            <span className="absolute bottom-1.5 left-1.5 text-white text-xs bg-black bg-opacity-50 px-1.5 py-0.5 rounded-md">{t('family_photo_album_day_prefix', {day: String(photo.day)})}</span>
                            {photo.uploadDate && (
                                <span className="absolute bottom-1.5 right-1.5 text-white text-xs bg-black bg-opacity-50 px-1.5 py-0.5 rounded-md">
                                    {new Date(photo.uploadDate + 'T00:00:00').toLocaleDateString(language, { year: '2-digit', month: '2-digit', day: '2-digit' })}
                                </span>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-slate-200 mb-4">{t('family_photo_album_modal_title')}</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('family_photo_album_modal_city_label')}</label>
                <select id="city" value={selectedCityId} onChange={e => setSelectedCityId(e.target.value)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="" disabled>Select a city</option>
                  {CITIES.map(city => <option key={city.id} value={city.id}>{t(city.nameKey)}</option>)}
                </select>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="day" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('family_photo_album_modal_day_label')}</label>
                    <input type="number" id="day" value={selectedDay} onChange={e => setSelectedDay(e.target.value)} placeholder={t('family_photo_album_modal_day_placeholder')} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md p-2" />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('family_photo_album_modal_date_label')}</label>
                    <input type="date" id="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 rounded-md p-2" />
                </div>
              </div>
              <div>
                <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-slate-300">{t('family_photo_album_modal_files_label')}</label>
                <input type="file" id="files" multiple accept="image/*" onChange={e => setSelectedFiles(e.target.files)} required className="mt-1 block w-full text-sm text-gray-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 dark:file:bg-slate-600 file:text-indigo-700 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-slate-500" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">{t('family_photo_album_modal_cancel')}</button>
              <button onClick={handleUpload} disabled={isUploading || !selectedCityId || !selectedDay || !selectedFiles || !selectedDate} className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center">
                {isUploading ? <><i className="fas fa-spinner fa-spin mr-2"></i>{t('family_photo_album_modal_uploading')}</> : <><i className="fas fa-check mr-2"></i>{t('family_photo_album_upload_btn')}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
         <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center" onClick={closeLightbox}>
            <button 
                onClick={e => { e.stopPropagation(); closeLightbox(); }}
                className="absolute top-4 right-4 text-white text-2xl w-12 h-12 flex items-center justify-center rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors"
                aria-label="Close image viewer"
            >
                <i className="fas fa-times"></i>
            </button>
            <button 
                onClick={e => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 text-white text-3xl w-14 h-14 flex items-center justify-center rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors"
                aria-label="Previous image"
            >
                <i className="fas fa-chevron-left"></i>
            </button>
            <img 
              src={currentLightboxGroup[lightboxIndex].imageDataUrl} 
              alt={t('family_photo_album_day_prefix', {day: String(currentLightboxGroup[lightboxIndex].day)})}
              className="max-h-[90vh] max-w-[90vw] object-contain" 
              onClick={e => e.stopPropagation()}
            />
            <button 
                onClick={e => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 text-white text-3xl w-14 h-14 flex items-center justify-center rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition-colors"
                aria-label="Next image"
            >
                <i className="fas fa-chevron-right"></i>
            </button>
         </div>
      )}
    </>
  );
};

export default FamilyPhotoAlbum;