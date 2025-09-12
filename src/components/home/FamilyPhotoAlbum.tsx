import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PhotoItem } from '../../types.ts';
import { v4 as uuidv4 } from 'uuid';
import { CITIES } from '../../constants.ts';

const FamilyPhotoAlbum: React.FC = () => {
  const { t, language } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<PhotoItem[] | null>(() => {
    try {
      const savedPhotos = localStorage.getItem('familyPhotos');
      return savedPhotos ? JSON.parse(savedPhotos) : null;
    } catch (e) {
      console.error("Failed to load photos from localStorage", e);
      return null;
    }
  });

  const getInitialPhotos = useCallback(() => {
    return CITIES.slice(0, 5).map((city) => ({
      id: `placeholder-${city.id}`,
      src: city.image,
      caption: t('photo_album_placeholder_caption', { cityName: t(city.nameKey) }),
      originalLang: language,
    }));
  }, [t, language]);

  useEffect(() => {
    if (photos === null) {
      setPhotos(getInitialPhotos());
    }
  }, [photos, getInitialPhotos]);

  useEffect(() => {
    if (photos !== null) {
      try {
        localStorage.setItem('familyPhotos', JSON.stringify(photos));
      } catch (e) {
        console.error("Failed to save photos to localStorage", e);
      }
    }
  }, [photos]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [captionInput, setCaptionInput] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto: PhotoItem = {
          id: uuidv4(),
          src: event.target?.result as string,
          caption: t('photo_album_default_caption'),
          originalLang: language,
        };
        setPhotos(prev => (prev ? [newPhoto, ...prev] : [newPhoto]));
        window.dispatchEvent(new Event('storage')); // Trigger sync
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditCaption = (photo: PhotoItem) => {
    setEditingId(photo.id);
    setCaptionInput(photo.caption);
  };

  const handleSaveCaption = (id: string) => {
    if (photos) {
      setPhotos(photos.map(p => (p.id === id ? { ...p, caption: captionInput } : p)));
      setEditingId(null);
      window.dispatchEvent(new Event('storage')); // Trigger sync
    }
  };

  const handleRemovePhoto = (id: string) => {
    if (window.confirm(t('photo_album_confirm_delete'))) {
      if (photos) {
        setPhotos(photos.filter(p => p.id !== id));
        window.dispatchEvent(new Event('storage')); // Trigger sync
      }
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

      {photos === null || photos.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
          <i className="fas fa-images text-5xl mb-4 text-gray-400 dark:text-slate-500"></i>
          <p>{photos === null ? t('loading') : t('photo_album_empty')}</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map(photo => (
            <div key={photo.id} className="break-inside-avoid relative group overflow-hidden rounded-lg shadow-md bg-gray-200 dark:bg-slate-700">
              <img src={photo.src} alt={photo.caption} className="w-full h-auto object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                {editingId === photo.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={captionInput}
                      onChange={(e) => setCaptionInput(e.target.value)}
                      onBlur={() => handleSaveCaption(photo.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveCaption(photo.id)}
                      autoFocus
                      className="w-full text-sm bg-white/90 dark:bg-slate-800/90 text-gray-800 dark:text-slate-200 border-indigo-500 rounded p-1.5"
                    />
                  </div>
                ) : (
                  <p className="text-white text-sm font-medium cursor-pointer" onClick={() => handleEditCaption(photo)}>
                    {photo.caption}
                  </p>
                )}
              </div>
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEditCaption(photo)} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-blue-600 hover:bg-white" aria-label={t('photo_album_edit_caption_label')}><i className="fas fa-pencil-alt"></i></button>
                <button onClick={() => handleRemovePhoto(photo.id)} className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-red-600 hover:bg-white" aria-label={t('photo_album_delete_photo_label')}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FamilyPhotoAlbum;
