import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef, FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PhotoItem, City } from '../../types.ts';
import { dbService } from '../../services/dbService.ts';

interface FamilyPhotoAlbumProps {
    city?: City;
}

const FamilyPhotoAlbum: FC<FamilyPhotoAlbumProps> = ({ city }) => {
    const { t, language } = useAppContext();
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [photoDetails, setPhotoDetails] = useState<{ caption: string, dateTaken: string, tripDay: number, cityId: string }[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = dbService.subscribeToPhotos((updatedPhotos) => {
            const filteredPhotos = city
                ? updatedPhotos.filter(p => p.cityId === city.id)
                : updatedPhotos;
            setPhotos(filteredPhotos);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [city]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);

            // Initialize details for each file
            const initialDetails = files.map(() => ({
                caption: '',
                dateTaken: new Date().toISOString().split('T')[0],
                tripDay: 1,
                cityId: city ? city.id : 'unclassified'
            }));
            setPhotoDetails(initialDetails);
            setEditingPhotoId(null); // Ensure we are in upload mode
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
        // We don't have a file object for existing photos, so selectedFiles is empty or ignored in edit mode
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
                // Update existing photo
                const details = photoDetails[0];
                await dbService.updatePhoto(editingPhotoId, {
                    caption: details.caption,
                    dateTaken: details.dateTaken,
                    tripDay: details.tripDay,
                    cityId: details.cityId
                });
            } else {
                // Save new photos
                const newPhotos: PhotoItem[] = [];
                for (let i = 0; i < selectedFiles.length; i++) {
                    const file = selectedFiles[i];
                    if (!file.type.startsWith('image/')) continue;

                    try {
                        // Upload to Firebase Storage
                        const downloadURL = await dbService.uploadImageToStorage(file);

                        newPhotos.push({
                            id: `${Date.now()}-${i}`,
                            src: downloadURL, // Use the Storage URL
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

            // No need to manually refresh or set sync status, subscription handles it
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

    return (
        <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl dark:shadow-slate-700/50">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-200 mb-6 flex items-center">
                <i className="fas fa-images mr-3 text-indigo-600 dark:text-indigo-400"></i>
                {t('photo_album_title')}
            </h2>

            {/* Upload Button */}
            <div className="mb-8 flex items-center justify-between">
                <div>
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

                <div className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2">
                    <i className="fas fa-cloud text-indigo-500"></i>
                    {t('status_synced')}
                </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {photos.map(photo => (
                    <div key={photo.id} className="group relative bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                        <img
                            src={photo.src}
                            alt={photo.caption}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                                target.onerror = null; // Prevent infinite loop
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
                {photos.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 dark:text-slate-400">
                        <i className="fas fa-camera text-4xl mb-3 block opacity-50"></i>
                        {t('photo_album_no_photos')}
                    </div>
                )}
            </div>

            {/* Upload/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">
                            {editingPhotoId ? t('photo_album_edit_title') : t('photo_album_upload_modal_title')}
                        </h3>

                        <div className="space-y-4 mb-6">
                            {/* If editing, show single form. If uploading, show list */}
                            {editingPhotoId ? (
                                <div className="flex gap-4 items-start border-b border-gray-200 dark:border-slate-700 pb-4">
                                    <div className="flex-grow space-y-2">
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
                                            <input
                                                type="number"
                                                placeholder="Day"
                                                value={photoDetails[0].tripDay}
                                                onChange={(e) => handleDetailChange(0, 'tripDay', parseInt(e.target.value))}
                                                className="w-1/2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                selectedFiles.map((file, index) => (
                                    <div key={index} className="flex gap-4 items-start border-b border-gray-200 dark:border-slate-700 pb-4">
                                        <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-lg flex-shrink-0 overflow-hidden">
                                            {/* Preview would go here if we read the file immediately, for now just placeholder icon */}
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <i className="fas fa-image text-2xl"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow space-y-2">
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
                                                <input
                                                    type="number"
                                                    placeholder="Day"
                                                    value={photoDetails[index].tripDay}
                                                    onChange={(e) => handleDetailChange(index, 'tripDay', parseInt(e.target.value))}
                                                    className="w-1/2 p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                                />
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