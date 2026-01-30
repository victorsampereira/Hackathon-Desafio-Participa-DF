import { useState, useEffect } from 'react';

/**
 * Hook para extrair e validar metadados de vídeo
 * Lê duração e valida limite de 120 segundos
 * 
 * @param {File} videoFile - Arquivo de vídeo
 * @param {number} maxDuration - Duração máxima em segundos (padrão: 120)
 * @returns {Object} Metadados e estado de validação
 */
const useVideoMetadata = (videoFile, maxDuration = 120) => {
    const [duration, setDuration] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if (!videoFile) {
            setDuration(0);
            setIsLoading(false);
            setError(null);
            setIsValid(true);
            return;
        }

        setIsLoading(true);
        setError(null);

        // Cria elemento de vídeo temporário para ler metadados
        const video = document.createElement('video');
        video.preload = 'metadata';

        const objectUrl = URL.createObjectURL(videoFile);
        video.src = objectUrl;

        const handleLoadedMetadata = () => {
            const videoDuration = Math.floor(video.duration);
            setDuration(videoDuration);
            setIsLoading(false);

            // Valida duração
            if (videoDuration > maxDuration) {
                setIsValid(false);
                setError(`O vídeo excede ${maxDuration} segundos (${Math.ceil(maxDuration / 60)} minutos). Envie um vídeo mais curto.`);
            } else {
                setIsValid(true);
            }

            // Cleanup
            URL.revokeObjectURL(objectUrl);
            video.remove();
        };

        const handleError = (e) => {
            console.error('Error loading video metadata:', e);
            setIsLoading(false);
            setError('Não foi possível carregar a pré-visualização. O arquivo foi mantido como anexo.');
            setIsValid(true); // Ainda aceita o arquivo

            // Cleanup
            URL.revokeObjectURL(objectUrl);
            video.remove();
        };

        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);

        // Cleanup se componente desmontar durante carregamento
        return () => {
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('error', handleError);
            URL.revokeObjectURL(objectUrl);
            video.remove();
        };
    }, [videoFile, maxDuration]);

    /**
     * Formata duração em mm:ss
     */
    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        duration,
        durationFormatted: formatDuration(duration),
        isLoading,
        isValid,
        error
    };
};

export default useVideoMetadata;
