import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar preview de arquivos (imagem/vídeo)
 * Cria Object URL e garante cleanup adequado
 * 
 * @returns {Object} Estado e funções para gerenciar preview
 */
const useFilePreview = () => {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    /**
     * Define o arquivo e cria Object URL para preview
     */
    const setFileWithPreview = useCallback((newFile) => {
        // Revoga URL anterior se existir
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }

        if (newFile) {
            const url = URL.createObjectURL(newFile);
            setFile(newFile);
            setPreviewUrl(url);
        } else {
            setFile(null);
            setPreviewUrl(null);
        }
    }, [previewUrl]);

    /**
     * Limpa o arquivo e revoga Object URL
     */
    const clearPreview = useCallback(() => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setFile(null);
        setPreviewUrl(null);
    }, [previewUrl]);

    /**
     * Cleanup ao desmontar componente
     */
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return {
        file,
        previewUrl,
        setFile: setFileWithPreview,
        clearPreview,
        hasFile: file !== null
    };
};

export default useFilePreview;
