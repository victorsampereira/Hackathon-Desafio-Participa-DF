/**
 * Tipos para sistema de manifestações
 * Projeto Participa Fácil - GDF
 */

/**
 * Canal de comunicação escolhido pelo cidadão
 * @typedef {'text' | 'audio' | 'image' | 'video'} Channel
 */

/**
 * Draft da manifestação (armazenado em memória e localStorage)
 * @typedef {Object} ManifestationDraft
 * @property {Channel} channel - Canal principal de comunicação
 * @property {string} [contentText] - Conteúdo textual (se canal texto)
 * @property {Blob} [audioBlob] - Blob do áudio gravado (se canal áudio)
 * @property {string} [audioMimeType] - Tipo MIME do áudio
 * @property {number} [audioDuration] - Duração do áudio em segundos
 * @property {File[]} [mediaFiles] - Arquivos de imagem/vídeo
 * @property {Object} [mediaMetadata] - Metadados dos arquivos (para localStorage)
 * @property {string} [locationText] - Texto descritivo da localização
 * @property {boolean} isAnonymous - Se manifestação é anônima
 * @property {Object} [identified] - Dados de identificação (se não anônimo)
 * @property {string} [identified.name] - Nome do cidadão
 * @property {string} [identified.contact] - E-mail ou telefone
 * @property {string} createdAtISO - Data de criação ISO 8601
 */

/**
 * Resultado do envio da manifestação
 * @typedef {Object} SubmitResult
 * @property {string} protocol - Número do protocolo (DF-2026-xxxxx)
 * @property {string} createdAtISO - Data de registro ISO 8601
 * @property {string} status - Status da manifestação (sempre 'RECEBIDA')
 * @property {Object[]} [attachments] - Lista de anexos
 * @property {string} attachments[].id - ID do anexo
 * @property {string} attachments[].name - Nome do arquivo
 * @property {string} attachments[].type - Tipo MIME
 * @property {number} attachments[].size - Tamanho em bytes
 */

/**
 * Erro de submissão
 * @typedef {Object} SubmitError
 * @property {string} code - Código do erro
 * @property {string} message - Mensagem amigável para o usuário
 */

export const ChannelType = {
    TEXT: 'text',
    AUDIO: 'audio',
    IMAGE: 'image',
    VIDEO: 'video'
};

export const SubmissionStatus = {
    IDLE: 'idle',
    SUBMITTING: 'submitting',
    SUCCESS: 'success',
    ERROR: 'error'
};

export const ErrorCode = {
    NETWORK_TIMEOUT: 'NETWORK_TIMEOUT',
    SERVER_ERROR: 'SERVER_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR'
};
