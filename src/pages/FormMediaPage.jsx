import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import useFilePreview from '../hooks/useFilePreview';
import useVideoMetadata from '../hooks/useVideoMetadata';
import { useManifestationDraft } from '../context/ManifestationDraftContext';

const FormMediaPage = () => {
    const navigate = useNavigate();
    const { draft, dispatch, actions } = useManifestationDraft();

    // Refs para inputs
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    // Hooks para preview
    const imagePreview = useFilePreview();
    const videoPreview = useFilePreview();

    // Hook para metadados de vídeo
    const videoMetadata = useVideoMetadata(videoPreview.file);

    // Estados de validação
    const [imageError, setImageError] = useState('');
    const [videoError, setVideoError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Descrição da mídia
    const [mediaDescription, setMediaDescription] = useState(draft.media?.description || '');

    // Constantes de validação
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10 MB
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB
    const MAX_VIDEO_DURATION = 120; // 2 minutos

    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

    /**
     * Formata tamanho de arquivo para exibição
     */
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' bytes';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    /**
     * Valida e processa upload de imagem
     */
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        setImageError('');
        setSuccessMessage('');

        if (!file) return;

        // Valida tipo
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            setImageError('Formato não suportado. Envie JPG, PNG ou WEBP.');
            return;
        }

        // Valida tamanho
        if (file.size > MAX_IMAGE_SIZE) {
            setImageError(`Imagem excede o limite de ${Math.floor(MAX_IMAGE_SIZE / (1024 * 1024))} MB.`);
            return;
        }

        // Define arquivo e cria preview
        imagePreview.setFile(file);
        setSuccessMessage('Imagem carregada com sucesso!');

        // Limpa input para permitir selecionar o mesmo arquivo novamente
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    /**
     * Valida e processa upload de vídeo
     */
    const handleVideoChange = (e) => {
        const file = e.target.files?.[0];
        setVideoError('');
        setSuccessMessage('');

        if (!file) return;

        // Valida tipo
        if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
            setVideoError('Formato não suportado. Envie MP4, WEBM ou OGG.');
            return;
        }

        // Valida tamanho
        if (file.size > MAX_VIDEO_SIZE) {
            setVideoError(`Vídeo excede o limite de ${Math.floor(MAX_VIDEO_SIZE / (1024 * 1024))} MB.`);
            return;
        }

        // Define arquivo e cria preview
        videoPreview.setFile(file);
        setSuccessMessage('Vídeo carregado com sucesso!');

        // Limpa input
        if (videoInputRef.current) {
            videoInputRef.current.value = '';
        }
    };

    // Atualiza Context quando arquivos mudam
    useEffect(() => {
        if (imagePreview.file) {
            dispatch({
                type: actions.SET_MEDIA,
                payload: {
                    image: {
                        file: imagePreview.file,
                        previewUrl: imagePreview.previewUrl,
                        name: imagePreview.file.name,
                        size: imagePreview.file.size,
                        type: imagePreview.file.type
                    }
                }
            });
        }
    }, [imagePreview.file, imagePreview.previewUrl, dispatch, actions]);

    useEffect(() => {
        if (videoPreview.file && videoMetadata.isValid) {
            dispatch({
                type: actions.SET_MEDIA,
                payload: {
                    video: {
                        file: videoPreview.file,
                        previewUrl: videoPreview.previewUrl,
                        name: videoPreview.file.name,
                        size: videoPreview.file.size,
                        type: videoPreview.file.type,
                        duration: videoMetadata.duration
                    }
                }
            });
        }
    }, [videoPreview.file, videoPreview.previewUrl, videoMetadata.isValid, videoMetadata.duration, dispatch, actions]);

    // Exibe erro de validação de vídeo
    useEffect(() => {
        if (videoMetadata.error && !videoMetadata.isValid) {
            setVideoError(videoMetadata.error);
            videoPreview.clearPreview();
        }
    }, [videoMetadata.error, videoMetadata.isValid, videoPreview]);

    // Atualiza descrição no Context
    useEffect(() => {
        dispatch({
            type: actions.SET_MEDIA,
            payload: {
                description: mediaDescription
            }
        });
    }, [mediaDescription, dispatch, actions]);

    const hasAnyFile = imagePreview.hasFile || videoPreview.hasFile;

    return (
        <Layout title="Envio de Mídia" showNav={false}>
            <div className="px-4 pt-6 pb-2">
                <h3 className="text-[#111418] dark:text-white tracking-tight text-2xl font-bold leading-tight">
                    Deseja enviar uma imagem ou vídeo?
                </h3>
            </div>

            <div className="px-4 pt-1 pb-4">
                <p className="text-[#4F6171] dark:text-gray-400 text-base font-normal leading-relaxed">
                    Você pode enviar um arquivo que ajude a explicar o ocorrido. Isso facilita a análise da sua manifestação.
                </p>
            </div>

            {/* Aviso de privacidade */}
            <div className="px-4 py-3">
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-lg">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 mt-0.5 text-xl">warning</span>
                    <div>
                        <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                            Envie apenas o necessário. Evite expor dados pessoais de terceiros.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mensagens de status */}
            {(successMessage || imageError || videoError) && (
                <div role="status" aria-live="polite" className="px-4 py-2">
                    {successMessage && (
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg">
                            <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                                {successMessage}
                            </p>
                        </div>
                    )}
                    {imageError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                                {imageError}
                            </p>
                        </div>
                    )}
                    {videoError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
                            <p className="text-red-800 dark:text-red-200 text-sm font-medium">
                                {videoError}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Upload de Imagem */}
            <div className="px-4 py-4">
                <h4 className="text-[#111418] dark:text-white text-lg font-bold mb-3">Imagem</h4>

                {!imagePreview.hasFile ? (
                    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#dbe0e6] dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 px-6 py-8">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-primary text-3xl">photo_camera</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[#111418] dark:text-white text-sm font-medium mb-1">
                                JPG, PNG ou WEBP (máx. 10 MB)
                            </p>
                        </div>
                        <label htmlFor="imageUpload" className="cursor-pointer">
                            <input
                                ref={imageInputRef}
                                id="imageUpload"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageChange}
                                className="hidden"
                                aria-label="Selecionar imagem"
                            />
                            <span className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">upload</span>
                                Selecionar Imagem
                            </span>
                        </label>
                    </div>
                ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden">
                            <img
                                src={imagePreview.previewUrl}
                                alt="Preview da imagem"
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-[#111418] dark:text-white font-medium text-sm truncate">
                                        {imagePreview.file.name}
                                    </p>
                                    <p className="text-[#617589] dark:text-gray-400 text-xs mt-1">
                                        {formatFileSize(imagePreview.file.size)}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <label htmlFor="imageUploadChange" className="cursor-pointer">
                                        <input
                                            id="imageUploadChange"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            aria-label="Trocar imagem"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('imageUploadChange').click()}
                                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            aria-label="Trocar imagem"
                                        >
                                            <span className="material-symbols-outlined text-lg">swap_horiz</span>
                                        </button>
                                    </label>
                                    <button
                                        onClick={() => imagePreview.clearPreview()}
                                        className="p-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        aria-label="Remover imagem"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Upload de Vídeo */}
            <div className="px-4 py-4">
                <h4 className="text-[#111418] dark:text-white text-lg font-bold mb-3">Vídeo</h4>

                {!videoPreview.hasFile ? (
                    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-[#dbe0e6] dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 px-6 py-8">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <span className="material-symbols-outlined text-primary text-3xl">videocam</span>
                        </div>
                        <div className="text-center">
                            <p className="text-[#111418] dark:text-white text-sm font-medium mb-1">
                                MP4, WEBM ou OGG (máx. 20 MB e 2 min)
                            </p>
                        </div>
                        <label htmlFor="videoUpload" className="cursor-pointer">
                            <input
                                ref={videoInputRef}
                                id="videoUpload"
                                type="file"
                                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                onChange={handleVideoChange}
                                className="hidden"
                                aria-label="Selecionar vídeo"
                            />
                            <span className="flex items-center justify-center gap-2 rounded-lg h-12 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all">
                                <span className="material-symbols-outlined">upload</span>
                                Selecionar Vídeo
                            </span>
                        </label>
                    </div>
                ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                            {videoMetadata.isLoading ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <p className="text-sm text-gray-500">Carregando...</p>
                                </div>
                            ) : (
                                <video
                                    src={videoPreview.previewUrl}
                                    controls
                                    className="max-w-full max-h-full"
                                    aria-label="Preview do vídeo"
                                >
                                    Seu navegador não suporta o elemento de vídeo.
                                </video>
                            )}
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <p className="text-[#111418] dark:text-white font-medium text-sm truncate">
                                        {videoPreview.file.name}
                                    </p>
                                    <p className="text-[#617589] dark:text-gray-400 text-xs mt-1">
                                        {formatFileSize(videoPreview.file.size)}
                                        {videoMetadata.duration > 0 && ` • ${videoMetadata.durationFormatted}`}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <label htmlFor="videoUploadChange" className="cursor-pointer">
                                        <input
                                            id="videoUploadChange"
                                            type="file"
                                            accept="video/mp4,video/webm,video/ogg,video/quicktime"
                                            onChange={handleVideoChange}
                                            className="hidden"
                                            aria-label="Trocar vídeo"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('videoUploadChange').click()}
                                            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            aria-label="Trocar vídeo"
                                        >
                                            <span className="material-symbols-outlined text-lg">swap_horiz</span>
                                        </button>
                                    </label>
                                    <button
                                        onClick={() => videoPreview.clearPreview()}
                                        className="p-2 rounded-lg border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        aria-label="Remover vídeo"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Descrição da mídia  */}
            {hasAnyFile && (
                <div className="px-4 py-4">
                    <div className="space-y-2">
                        <label className="flex flex-col">
                            <div className="flex items-center gap-2 pb-2">
                                <span className="text-[#111418] dark:text-white text-base font-bold">
                                    Caso queira, Descreva o problema mostrado
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                                    ajuda na análise
                                </span>
                            </div>
                            <textarea
                                value={mediaDescription}
                                onChange={(e) => setMediaDescription(e.target.value)}
                                maxLength={500}
                                className="form-input flex w-full min-w-0 resize-none rounded-xl text-[#111418] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary border border-[#dbe0e6] dark:border-[#2e363d] bg-white dark:bg-[#1a2128] focus:border-primary min-h-[120px] placeholder:text-[#617589] p-4 text-base font-normal leading-normal transition-shadow"
                                placeholder="Exemplo: Na imagem é possível ver o buraco na calçada em frente ao número 123..."
                            ></textarea>
                            <div className="pt-2 text-right">
                                <span className="text-[#617589] text-xs">
                                    {mediaDescription.length} / 500 caracteres
                                </span>
                            </div>
                        </label>

                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm mt-0.5">lightbulb</span>
                            <p className="text-blue-800 dark:text-blue-200 text-xs">
                                Essa descrição ajuda a IA IZA a classificar melhor sua manifestação e direcionar para o órgão correto.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Botões de navegação */}
            <div className="p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3 mt-8">
                <button
                    onClick={() => navigate('/form-location')}
                    disabled={!hasAnyFile}
                    className="w-full bg-primary text-white font-bold h-12 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-[0.98] transition-all"
                    aria-label={hasAnyFile ? "Continuar para próxima etapa" : "Selecione ao menos um arquivo para continuar"}
                >
                    {hasAnyFile ? 'Continuar' : 'Selecione um arquivo'}
                </button>
                <button
                    onClick={() => navigate('/form-location')}
                    className="w-full bg-transparent text-[#4F6171] dark:text-gray-400 font-semibold h-12 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 active:scale-[0.98] transition-all"
                >
                    Pular esta etapa
                </button>
            </div>
        </Layout>
    );
};

export default FormMediaPage;
