
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef, FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PhotoItem, City } from '../../types.ts';
import { dbService } from '../../services/dbService.ts';
import { CITIES } from '../../constants.ts';

interface FamilyPhotoAlbumProps {
    city?: City;
}

const FamilyPhotoAlbum: FC<FamilyPhotoAlbumProps> = ({ city }) => {
    const { t, language } = useAppContext();
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [photoDetails, setPhotoDetails] = useState<{ caption: string, dateTaken: string, tripDay: number, cityId: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = dbService.subscribeToPhotos((updatedPhotos) => {
            // If a specific city prop is passed, we could filter here, but for the "All Albums" view we need all photos.
            // We'll filter at render time or derived state to keep it simple.
            setPhotos(updatedPhotos);
        });

        return () => unsubscribe();
    }, []);

    // Reset selection if city prop changes (though usually it won't change dynamically like that in this app)
    useEffect(() => {
        if (city) {
            setSelectedCityId(null);
        }
    }, [city]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);

            // Determine default city for new photos
            // If we are in a specific city view (prop or selected), use that. Default to 'buenosaires' otherwise.
            const currentActiveCityId = city?.id || selectedCityId || 'buenosaires';
            const defaultCityId = currentActiveCityId === 'unclassified' ? 'buenosaires' : currentActiveCityId;

            const initialDetails = files.map(() => ({
                caption: '',
                dateTaken: new Date().toISOString().split('T')[0],
                tripDay: 1,
                cityId: defaultCityId
            }));
            setPhotoDetails(initialDetails);
            setEditingPhotoId(null);
            setIsModalOpen(true);
        }
    };

    const handleEditPhoto = (photo: PhotoItem) => {
        setEditingPhotoId(photo.id);
        setPhotoDetails([{
            caption: photo.caption || '',
            dateTaken: photo.dateTaken || new Date().toISOString().split('T')[0],
            tripDay: photo.tripDay || 1,
            cityId: photo.cityId || 'unclassified'
        }]);
        setSelectedFiles([]);
        setIsModalOpen(true);
    };

    const handleDetailChange = (index: number, field: string, value: string | number) => {
        const newDetails = [...photoDetails];
        newDetails[index] = { ...newDetails[index], [field]: value };
        setPhotoDetails(newDetails);
    };

    const handleSavePhotos = async () => {
        setIsLoading(true);
        try {
            if (editingPhotoId) {
                const details = photoDetails[0];
                await dbService.updatePhoto(editingPhotoId, {
                    caption: details.caption,
                    dateTaken: details.dateTaken,
                    tripDay: details.tripDay,
                    cityId: details.cityId
                });
            } else {
                const newPhotos: PhotoItem[] = [];
                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    if (!file.type.startsWith('image/')) continue;

                    try {
                        const downloadURL = await dbService.uploadImageToStorage(file);
                        newPhotos.push({
                            id: `${Date.now()}-${i}`,
                            src: downloadURL,
                            caption: photoDetails[i]?.caption || '',
                            originalLang: language,
                            dateTaken: photoDetails[i]?.dateTaken || new Date().toISOString(),
                            tripDay: photoDetails[i]?.tripDay || 1,
                            cityId: photoDetails[i]?.cityId || 'unclassified',
                        });
                    } catch (err) {
                        console.error(`Error processing file ${file.name}:`, err);
                    }
                }
                if (newPhotos.length > 0) {
                    await dbService.addPhotosBatch(newPhotos);
                }
            }
            setIsModalOpen(false);
            setSelectedFiles([]);
            setPhotoDetails([]);
            setEditingPhotoId(null);
        } catch (error) {
            console.error("Error saving photos:", error);
            alert(t('photo_album_error_saving'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePhoto = async (id: string, src: string) => {
        if (confirm(t('photo_album_confirm_delete'))) {
            await dbService.deletePhoto(id, src);
        }
    };

    // --- DERIVED STATE & RENDER LOGIC ---

    // 1. Determine which view to show: Album Grid or Photo Grid
    // If 'city' prop is present, we are always in Photo Grid for that city.
    // If 'selectedCityId' is present, we are in Photo Grid for that city.
    // Otherwise, we are in Album Grid.
    const activeCityId = city ? city.id : selectedCityId;
    const isPhotoGridView = !!activeCityId;

    // 2. Prepare data for Album Grid
    const getAlbumStats = () => {
        const stats: Record<string, { count: number, cover: string | null }> = {};
        CITIES.forEach(c => stats[c.id] = { count: 0, cover: null });
        stats['unclassified'] = { count: 0, cover: null };

        photos.forEach(p => {
            const cid = p.cityId && stats[p.cityId] ? p.cityId : 'unclassified';
            stats[cid].count++;
            // Use the first photo found as cover if not set
            // Ideally we might want the *latest* photo, but random is fine for now
            if (!stats[cid].cover) stats[cid].cover = p.src;
        });
        return stats;
    };
    const albumStats = getAlbumStats();

    // 3. Prepare data for Photo Grid
    const filteredPhotos = isPhotoGridView
        ? photos.filter(p => {
            if (activeCityId === 'unclassified') {
                return !p.cityId || !CITIES.find(c => c.id === p.cityId);
            }
            return p.cityId === activeCityId;
        })
        : [];

    const activeCityObj = CITIES.find(c => c.id === activeCityId);
    const activeCityName = activeCityId === 'unclassified' 
        ? 'Otros / Sin Clasificar' 
        : (activeCityObj ? t(activeCityObj.nameKey) : activeCityId);

    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 flex items-center">
                    <i className="fas fa-images mr-3 text-indigo-600 dark:text-indigo-400"></i>
                    {t('photo_album_title')}
                    {isPhotoGridView && !city && (
                        <span className="text-lg font-normal text-gray-500 dark:text-slate-400 ml-3">
                            / {activeCityName}
                        </span>
                    )}
                </h2>
                
                <div className="flex items-center gap-4">
                    {/* Back Button - Only show if we navigated here from Album Grid */}
                    {isPhotoGridView && !city && (
                        <button
                            onClick={() => setSelectedCityId(null)}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold flex items-center gap-2 transition-colors"
                        >
                            <i className="fas fa-arrow-left"></i>
                            {t('back')}
                        </button>
                    )}

                    <div className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                        <i className="fas fa-cloud text-indigo-500"></i>
                        {t('status_synced')}
                    </div>
                </div>
            </div>

            {/* Upload Button - Always visible */}
            <div className="mb-8">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    ref={fileInputRef}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                    <i className="fas fa-upload"></i> {t('photo_album_upload_button')}
                </button>
            </div>

            {/* VIEW 1: ALBUM GRID (City Cards) */}
            {!isPhotoGridView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {CITIES.map(cityItem => {
                        const stats = albumStats[cityItem.id];
                        // Use city default image if no photos, or the cover photo
                        const coverImage = stats.cover || cityItem.image;
                        
                        return (
                            <div 
                                key={cityItem.id}
                                onClick={() => setSelectedCityId(cityItem.id)}
                                className="group cursor-pointer bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={coverImage} 
                                        alt={t(cityItem.nameKey)}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    <div className="absolute bottom-3 left-4 text-white">
                                        <h3 className="text-xl font-bold shadow-black drop-shadow-md">{t(cityItem.nameKey)}</h3>
                                        <p className="text-sm opacity-90 font-medium">
                                            {stats.count} {stats.count === 1 ? t('photo_count_singular') : t('photo_count_plural')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Unclassified Album */}
                    {albumStats['unclassified'].count > 0 && (
                        <div 
                            onClick={() => setSelectedCityId('unclassified')}
                            className="group cursor-pointer bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="h-48 overflow-hidden relative bg-gray-300 dark:bg-slate-600 flex items-center justify-center">
                                {albumStats['unclassified'].cover ? (
                                    <img 
                                        src={albumStats['unclassified'].cover} 
                                        alt={t('album_others')}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <i className="fas fa-folder-open text-4xl text-gray-400 dark:text-slate-500"></i>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-3 left-4 text-white">
                                    <h3 className="text-xl font-bold shadow-black drop-shadow-md">{t('album_others')}</h3>
                                    <p className="text-sm opacity-90 font-medium">
                                        {albumStats['unclassified'].count} {albumStats['unclassified'].count === 1 ? t('photo_count_singular') : t('photo_count_plural')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* VIEW 2: PHOTO GRID (Specific City) */}
            {isPhotoGridView && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                    {filteredPhotos.map(photo => (
                        <div key={photo.id} className="group relative bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                            <img
                                src={photo.src}
                                alt={photo.caption}
                                className="w-full h-48 object-cover"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                                    target.onerror = null;
                                }}
                            />
                            <div className="p-3">
                                <p className="text-sm text-gray-600 dark:text-slate-300 italic mb-1">{photo.dateTaken}</p>
                                <p className="text-gray-800 dark:text-slate-100 font-semibold truncate">{photo.caption}</p>
                            </div>
                            <button
                                onClick={() => handleDeletePhoto(photo.id, photo.src)}
                                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                                title={t('photo_album_delete_tooltip')}
                            >
                                <i className="fas fa-trash-alt"></i>
                            </button>
                            <button
                                onClick={() => handleEditPhoto(photo)}
                                className="absolute top-2 right-12 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-blue-700"
                                title={t('photo_album_edit_tooltip')}
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                        </div>
                    ))}
                    {filteredPhotos.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 dark:text-slate-400">
                            <i className="fas fa-camera text-4xl mb-3 block opacity-50"></i>
                            {t('photo_album_no_photos')}
                        </div>
                    )}
                </div>
            )}

            {/* Upload/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">
                            {editingPhotoId ? t('photo_album_edit_title') : t('photo_album_upload_modal_title')}
                        </h3>

                        <div className="space-y-4 mb-6">
                            {editingPhotoId ? (
                                <div className="flex gap-4 items-start border-b border-gray-200 dark:border-slate-700 pb-4">
                                    <div className="grow space-y-2">
                                        <input
                                            type="text"
                                            placeholder={t('photo_album_caption_placeholder')}
                                            value={photoDetails[0].caption}
                                            onChange={(e) => handleDetailChange(0, 'caption', e.target.value)}
                                            className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="date"
                                                value={photoDetails[0].dateTaken}
                                                onChange={(e) => handleDetailChange(0, 'dateTaken', e.target.value)}
                                                className="w-1/2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                            />
                                            <select
                                                value={photoDetails[0].cityId}
                                                onChange={(e) => handleDetailChange(0, 'cityId', e.target.value)}
                                                className="w-1/2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                            >
                                                {CITIES.map(c => (
                                                    <option key={c.id} value={c.id}>{t(c.nameKey)}</option>
                                                ))}
                                                <option value="unclassified">{t('album_others')}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                selectedFiles.map((file, index) => (
                                    <div key={index} className="flex gap-4 items-start border-b border-gray-200 dark:border-slate-700 pb-4">
                                        <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-lg shrink-0 overflow-hidden">
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <i className="fas fa-image text-2xl"></i>
                                            </div>
                                        </div>
                                        <div className="grow space-y-2">
                                            <p className="font-semibold text-sm text-gray-700 dark:text-slate-300 truncate">{file.name}</p>
                                            <input
                                                type="text"
                                                placeholder={t('photo_album_caption_placeholder')}
                                                value={photoDetails[index].caption}
                                                onChange={(e) => handleDetailChange(index, 'caption', e.target.value)}
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                            />
                                            <div className="flex gap-2">
                                                <input
                                                    type="date"
                                                    value={photoDetails[index].dateTaken}
                                                    onChange={(e) => handleDetailChange(index, 'dateTaken', e.target.value)}
                                                    className="w-1/2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                                />
                                                <select
                                                    value={photoDetails[index].cityId}
                                                    onChange={(e) => handleDetailChange(index, 'cityId', e.target.value)}
                                                    className="w-1/2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                                >
                                                    {CITIES.map(c => (
                                                        <option key={c.id} value={c.id}>{t(c.nameKey)}</option>
                                                    ))}
                                                    <option value="unclassified">{t('album_others')}</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleSavePhotos}
                                disabled={isLoading}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FamilyPhotoAlbum;
