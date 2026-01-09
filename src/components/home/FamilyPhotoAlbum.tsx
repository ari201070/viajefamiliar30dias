
import 'leaflet/dist/leaflet.css';
import { useState, useEffect, useRef, FC } from 'react';
import { useAppContext } from '../../context/AppContext.tsx';
import { PhotoItem, City } from '../../types.ts';
import { dbService } from '../../services/dbService.ts';
import { CITIES } from '../../constants.ts';
import { extractBatchMetadata } from '../../utils/photoMetadata.ts';

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
    const [viewingPhoto, setViewingPhoto] = useState<PhotoItem | null>(null);
    const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(false);
    const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Batch Import State
    const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
    // const [batchSelectedFiles, setBatchSelectedFiles] = useState<File[]>([]); // Removed unused state
    const batchFileInputRef = useRef<HTMLInputElement>(null); // Ref for batch file input
    const [batchPhotoCards, setBatchPhotoCards] = useState<{
        file: File;
        thumbnail: string;
        caption: string;
        dateTaken: string;
        cityId: string;
    }[]>([]);
    const [consensusMessage, setConsensusMessage] = useState<string>('');
    const [batchConfig, setBatchConfig] = useState({
        description: '',
        date: new Date().toISOString().split('T')[0],
        cityId: 'buenosaires'
    });

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribe = dbService.subscribeToPhotos((updatedPhotos) => {
            setPhotos(updatedPhotos);
        });
        return () => unsubscribe();
    }, []);

    // --- DERIVED STATE ---
    const activeCityId = city ? city.id : selectedCityId;
    const isPhotoGridView = !!activeCityId;

    const getAlbumStats = () => {
        const stats: Record<string, { count: number, cover: string | null }> = {};
        CITIES.forEach(c => stats[c.id] = { count: 0, cover: null });
        stats['unclassified'] = { count: 0, cover: null };

        photos.forEach(p => {
            const cid = p.cityId && stats[p.cityId] ? p.cityId : 'unclassified';
            stats[cid].count++;
            if (!stats[cid].cover) stats[cid].cover = p.src;
        });
        return stats;
    };
    const albumStats = getAlbumStats();

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

    // --- NAVIGATION & SLIDESHOW HANDLERS ---
    const handleNextPhoto = () => {
        if (!viewingPhoto || filteredPhotos.length === 0) return;
        const currentIndex = filteredPhotos.findIndex(p => p.id === viewingPhoto.id);
        const nextIndex = (currentIndex + 1) % filteredPhotos.length;
        setViewingPhoto(filteredPhotos[nextIndex]);
    };

    const handlePrevPhoto = () => {
        if (!viewingPhoto || filteredPhotos.length === 0) return;
        const currentIndex = filteredPhotos.findIndex(p => p.id === viewingPhoto.id);
        const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        setViewingPhoto(filteredPhotos[prevIndex]);
    };

    const toggleSlideshow = () => {
        setIsSlideshowPlaying(!isSlideshowPlaying);
    };

    // Slideshow Effect
    useEffect(() => {
        let interval: any;
        if (isSlideshowPlaying && viewingPhoto) {
            interval = setInterval(() => {
                handleNextPhoto();
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isSlideshowPlaying, viewingPhoto, filteredPhotos]);

    // Reset selection if city prop changes
    useEffect(() => {
        if (city) {
            setSelectedCityId(null);
        }
    }, [city]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);
            setSelectedFiles(files);

            // Determine default city for new photos
            const currentActiveCityId = city?.id || selectedCityId || 'buenosaires';
            const defaultCityId = currentActiveCityId === 'unclassified' ? 'buenosaires' : currentActiveCityId;

            // Extract EXIF metadata from all files with context-aware clustering
            try {
                const metadataArray = await extractBatchMetadata(files);

                const initialDetails = files.map((_file, index) => {
                    const metadata = metadataArray[index];
                    
                    return {
                        // Use suggested place name if available, otherwise empty
                        caption: metadata.suggestedCaption || '',
                        // Use EXIF date if available, otherwise current date
                        dateTaken: metadata.dateTaken || new Date().toISOString().split('T')[0],
                        tripDay: 1,
                        // Use suggested city from GPS if available, otherwise default
                        cityId: metadata.suggestedCityId || defaultCityId
                    };
                });
                
                setPhotoDetails(initialDetails);
                console.log('Auto-populated photo details from EXIF:', initialDetails);
            } catch (error) {
                console.error('Error extracting EXIF metadata:', error);
                
                // Fallback to default values if EXIF extraction fails
                const initialDetails = files.map(() => ({
                    caption: '',
                    dateTaken: new Date().toISOString().split('T')[0],
                    tripDay: 1,
                    cityId: defaultCityId
                }));
                setPhotoDetails(initialDetails);
            }
            
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
                            originalFilename: file.name
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

    // Batch Upload Handlers
    const handleBatchImportClick = () => {
        setIsBatchModalOpen(true);
        setBatchPhotoCards([]);
        // setBatchSelectedFiles([]);
        setConsensusMessage('');
        setBatchConfig({
            description: '',
            date: new Date().toISOString().split('T')[0],
            cityId: activeCityId || 'buenosaires'
        });
    };

    const handleBatchFileSelect = async (files: File[]) => {
        if (files.length === 0) return;
        
        // setBatchSelectedFiles(files);
        setIsLoading(true);
        
        try {
            // Extract metadata with consensus logic
            const metadataArray = await extractBatchMetadata(files);
            
            // Count place names to detect consensus
            const placeNames = metadataArray
                .map(m => m.suggestedCaption)
                .filter(Boolean) as string[];
            
            const placeCounts = new Map<string, number>();
            placeNames.forEach(name => {
                placeCounts.set(name, (placeCounts.get(name) || 0) + 1);
            });
            
            // Determine if consensus was applied
            if (placeCounts.size > 1) {
                const maxCount = Math.max(...placeCounts.values());
                const consensusPlace = Array.from(placeCounts.entries())
                    .find(([_, count]) => count === maxCount)?.[0];
                if (consensusPlace && maxCount > 1) {
                    setConsensusMessage(`Consenso aplicado: "${consensusPlace}" en ${maxCount} fotos`);
                }
            }
            
            // Create photo cards
            const currentActiveCityId = city?.id || selectedCityId || 'buenosaires';
            const defaultCityId = currentActiveCityId === 'unclassified' ? 'buenosaires' : currentActiveCityId;
            
            const cards = files.map((file, index) => ({
                file,
                thumbnail: URL.createObjectURL(file),
                caption: metadataArray[index].suggestedCaption || '',
                dateTaken: metadataArray[index].dateTaken || new Date().toISOString().split('T')[0],
                cityId: metadataArray[index].suggestedCityId || defaultCityId,
                originalFilename: file.name
            }));
            
            setBatchPhotoCards(cards);
            console.log('Auto-populated batch photo details from EXIF:', cards.map(c => ({
                caption: c.caption,
                dateTaken: c.dateTaken,
                cityId: c.cityId
            })));
        } catch (error) {
            console.error('Error extracting metadata:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        await handleBatchFileSelect(files);
    };

    const handleBatchCardEdit = (index: number, field: 'caption' | 'dateTaken' | 'cityId', value: string) => {
        setBatchPhotoCards(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleBatchImport = async () => {
        if (batchPhotoCards.length === 0) {
            alert('Por favor selecciona fotos primero');
            return;
        }

        // // 1. Check for duplicates (DISABLED FOR STABILITY)
        // const existingFilenames = new Set(photos.map(p => p.originalFilename || p.caption)); 
        // const duplicates = batchPhotoCards.filter(card => existingFilenames.has(card.file.name));

        // if (duplicates.length > 0) {
        //     const confirmMsg = `¡Atención! Las siguientes ${duplicates.length} fotos parece que YA existen en el álbum:\n\n` +
        //         duplicates.slice(0, 5).map(d => `- ${d.file.name}`).join('\n') +
        //         (duplicates.length > 5 ? `\n... y ${duplicates.length - 5} más.` : '') +
        //         `\n\n¿Deseas subirlas de todas formas? (Se crearán copias)`;
            
        //     if (!confirm(confirmMsg)) {
        //         return; // User cancelled
        //     }
        // }

        setIsLoading(true);
        try {
            const newPhotos: PhotoItem[] = [];
            const { description } = batchConfig;

            // Process each photo card
            for (let i = 0; i < batchPhotoCards.length; i++) {
                const card = batchPhotoCards[i];

                try {
                    // Upload file to storage
                    const downloadURL = await dbService.uploadImageToStorage(card.file);
                    
                    const tripDay = Math.floor((new Date(card.dateTaken).getTime() - new Date('2025-09-16').getTime()) / (1000 * 60 * 60 * 24)) + 1;

                    const newPhoto: PhotoItem = {
                        id: `photo-${Date.now()}-${i}`,
                        src: downloadURL,
                        caption: card.caption || description || card.file.name,
                        originalLang: language,
                        dateTaken: card.dateTaken,
                        tripDay,
                        cityId: card.cityId,
                        timestamp: Date.now(),
                        // originalFilename: card.file.name
                    };

                    await dbService.addPhoto(newPhoto);
                    newPhotos.push(newPhoto);
                } catch (error) {
                    console.error(`Error uploading ${card.file.name}:`, error);
                    alert(`Error al subir ${card.file.name}`);
                }
            }

            // Update state -> REMOVED manual update to avoid duplicates with real-time listener
            // setPhotos((prev) => [...prev, ...newPhotos]); 

            // Close modal and reset
            setIsBatchModalOpen(false);
            setBatchPhotoCards([]);
            // setBatchSelectedFiles([]);
            setConsensusMessage('');
            setBatchConfig({
                description: '',
                date: new Date().toISOString().split('T')[0],
                cityId: 'buenosaires'
            });

            if (newPhotos.length > 0) {
                alert(`${newPhotos.length} fotos guardadas exitosamente`);
            }
        } catch (error) {
            console.error('Batch upload error:', error);
            alert('Error al guardar las fotos');
        } finally {
            setIsLoading(false);
        }
    };
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-');
        return `${d}.${m}.${y}`;
    };

    // --- RENDER LOGIC ---

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
            <div className="mb-8 flex gap-4">
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

                <button
                    onClick={handleBatchImportClick}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                >
                    <i className="fas fa-layer-group"></i> {t('photo_album_batch_import_button')}
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
                                className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                                onClick={() => setViewingPhoto(photo)}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                                    target.onerror = null;
                                }}
                            />
                            <div className="p-3">
                                <p className="text-sm text-gray-600 dark:text-slate-300 italic mb-1">{formatDate(photo.dateTaken)}</p>
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

            {/* Batch Import Modal */}
            {isBatchModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">
                             {t('photo_album_batch_modal_title')}
                        </h3>

                        {/* Drag & Drop Upload Area */}
                        {batchPhotoCards.length === 0 && (
                            <div>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            handleBatchFileSelect(Array.from(e.target.files));
                                        }
                                    }}
                                    className="hidden"
                                    ref={batchFileInputRef}
                                />
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => batchFileInputRef.current?.click()}
                                    className="w-full bg-emerald-100 dark:bg-emerald-900/30 border-2 border-dashed border-emerald-500 rounded-lg py-12 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors flex flex-col items-center gap-3 cursor-pointer"
                                >
                                    <i className="fas fa-cloud-upload-alt text-5xl text-emerald-600 dark:text-emerald-400"></i>
                                    <span className="text-emerald-700 dark:text-emerald-300 font-semibold text-lg">
                                        Arrastra fotos aquí o haz clic para seleccionar
                                    </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-sm">
                                        (Se extraerán automáticamente fecha, ubicación y lugar)
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Photo Cards with Metadata */}
                        {batchPhotoCards.length > 0 && (
                            <div className="space-y-4">
                                {/* Consensus Message */}
                                {consensusMessage && (
                                    <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded">
                                        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                                            <i className="fas fa-info-circle"></i>
                                            <span className="font-semibold">{consensusMessage}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Photo Count */}
                                <div className="flex items-center justify-between">
                                    <p className="text-gray-700 dark:text-slate-300">
                                        <i className="fas fa-images mr-2"></i>
                                        {batchPhotoCards.length} {batchPhotoCards.length === 1 ? 'foto seleccionada' : 'fotos seleccionadas'}
                                    </p>
                                    <button
                                        onClick={() => {
                                            setBatchPhotoCards([]);
                                            // setBatchSelectedFiles([]);
                                            setConsensusMessage('');
                                        }}
                                        className="text-sm text-gray-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                                    >
                                        <i className="fas fa-times mr-1"></i> Limpiar
                                    </button>
                                </div>

                                {/* Photo Cards List */}
                                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                                    {batchPhotoCards.map((card, index) => (
                                        <div key={index} className="flex gap-3 bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-200 dark:border-slate-600">
                                            {/* Thumbnail */}
                                            <img
                                                src={card.thumbnail}
                                                alt={card.file.name}
                                                className="w-20 h-20 object-cover rounded flex-shrink-0"
                                            />
                                            
                                            {/* Metadata */}
                                            <div className="flex-1 min-w-0 space-y-2">
                                                <p className="text-xs text-gray-500 dark:text-slate-400 truncate">{card.file.name}</p>
                                                
                                                <input
                                                    type="text"
                                                    value={card.caption}
                                                    onChange={(e) => handleBatchCardEdit(index, 'caption', e.target.value)}
                                                    placeholder="Descripción"
                                                    className="w-full text-sm p-1.5 border rounded dark:bg-slate-700 dark:border-slate-600"
                                                />
                                                
                                                <div className="flex gap-2">
                                                    <input
                                                        type="date"
                                                        value={card.dateTaken}
                                                        onChange={(e) => handleBatchCardEdit(index, 'dateTaken', e.target.value)}
                                                        className="flex-1 text-sm p-1.5 border rounded dark:bg-slate-700 dark:border-slate-600"
                                                    />
                                                    <select
                                                        value={card.cityId}
                                                        onChange={(e) => handleBatchCardEdit(index, 'cityId', e.target.value)}
                                                        className="flex-1 text-sm p-1.5 border rounded dark:bg-slate-700 dark:border-slate-600"
                                                    >
                                                        {CITIES.map(c => (
                                                            <option key={c.id} value={c.id}>{t(c.nameKey)}</option>
                                                        ))}
                                                        <option value="unclassified">{t('album_others')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Optional Common Description */}
                                <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                                        Descripción Común (Opcional - se aplicará solo a fotos sin descripción)
                                    </label>
                                    <input
                                        type="text"
                                        value={batchConfig.description}
                                        onChange={(e) => setBatchConfig({...batchConfig, description: e.target.value})}
                                        placeholder="Ej: Cena en Mendoza"
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setIsBatchModalOpen(false);
                                    setBatchPhotoCards([]);
                                    // setBatchSelectedFiles([]);
                                    setConsensusMessage('');
                                }}
                                className="px-4 py-2 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={handleBatchImport}
                                disabled={isLoading || batchPhotoCards.length === 0}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading && <i className="fas fa-spinner fa-spin"></i>}
                                Guardar Todo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Viewer Modal */}
            {viewingPhoto && (
                <div 
                    className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
                    onClick={() => {
                        setViewingPhoto(null);
                        setIsSlideshowPlaying(false);
                    }}
                >
                    <button
                        onClick={() => setViewingPhoto(null)}
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 focus:outline-hidden"
                    >
                        &times;
                    </button>
                    <div 
                        className="max-w-5xl max-h-screen w-full flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                    >
                        <img
                            src={viewingPhoto.src}
                            alt={viewingPhoto.caption}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />
                        <div className="mt-4 text-center text-white">
                            <h3 className="text-xl font-bold">{viewingPhoto.caption}</h3>
                            <p className="text-sm opacity-80">{formatDate(viewingPhoto.dateTaken)}</p>
                        </div>
                        
                        {/* Navigation Controls */}
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrevPhoto(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                        >
                            <i className="fas fa-chevron-left text-4xl"></i>
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNextPhoto(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-2"
                        >
                            <i className="fas fa-chevron-right text-4xl"></i>
                        </button>

                        {/* Top Controls */}
                        <div className="absolute top-4 right-16 flex items-center gap-4">
                            <button
                                onClick={(e) => { e.stopPropagation(); toggleSlideshow(); }}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full transition-colors ${
                                    isSlideshowPlaying ? 'bg-indigo-600 text-white' : 'bg-black/50 text-white hover:bg-black/70'
                                }`}
                            >
                                <i className={`fas ${isSlideshowPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                                <span className="text-sm font-medium">{t('photo_album_slideshow')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FamilyPhotoAlbum;
