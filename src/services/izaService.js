/**
 * Serviço de Integração com IA IZA (Mock)
 * Sistema de classificação automática de manifestações do Participa Fácil
 * 
 * IMPORTANTE: Este é um MOCK realista para demonstração.
 * Em produção, seria integrado com a IA IZA real do GDF.
 */

import { IZAPriority, IZACategory, IZAAgency } from '../types/iza';

/**
 * Dicionário de palavras-chave por categoria
 * Cada categoria tem padrões e pesos
 */
const KEYWORDS_DICTIONARY = {
    health: {
        category: IZACategory.HEALTH,
        agency: IZAAgency.HEALTH,
        keywords: {
            strong: ['upa', 'hospital', 'hran', 'hbase', 'emergência', 'pronto socorro', 'médico', 'enfermeiro'],
            medium: ['consulta', 'vacina', 'remédio', 'medicamento', 'atestado', 'exame', 'tratamento'],
            weak: ['saúde', 'doente', 'dor']
        }
    },
    transport: {
        category: IZACategory.TRANSPORT,
        agency: IZAAgency.TRANSPORT,
        keywords: {
            strong: ['ônibus', 'metrô', 'dftrans', 'bilhete único', 'linha', 'parada'],
            medium: ['transporte', 'lotação', 'atraso', 'horário', 'itinerário', 'passe livre'],
            weak: ['passagem', 'viagem']
        }
    },
    education: {
        category: IZACategory.EDUCATION,
        agency: IZAAgency.EDUCATION,
        keywords: {
            strong: ['escola', 'creche', 'ced', 'professor', 'matrícula'],
            medium: ['aluno', 'sala de aula', 'merenda', 'uniforme', 'transporte escolar'],
            weak: ['educação', 'ensino', 'aula']
        }
    },
    security: {
        category: IZACategory.SECURITY,
        agency: IZAAgency.SECURITY,
        keywords: {
            strong: ['assalto', 'roubo', 'polícia', 'violência', 'ameaça', 'agressão'],
            medium: ['segurança', 'crime', 'furto', 'pm', 'militar'],
            weak: ['medo', 'perigo']
        }
    },
    urbanServices: {
        category: IZACategory.URBAN_SERVICES,
        agency: IZAAgency.SLU, // Pode variar conforme palavra específica
        keywords: {
            strong: ['lixo', 'entulho', 'buraco', 'iluminação pública', 'poste', 'água', 'esgoto'],
            medium: ['calçada', 'passeio', 'pavimentação', 'asfalto', 'vazamento'],
            weak: ['sujeira', 'obras', 'reparo']
        }
    },
    noise: {
        category: IZACategory.NOISE,
        agency: IZAAgency.DF_LEGAL,
        keywords: {
            strong: ['som alto', 'barulho', 'perturbação', 'df legal'],
            medium: ['ruído', 'festa', 'vizinho', 'silêncio'],
            weak: ['som', 'música']
        }
    }
};

/**
 * Palavras-chave que indicam urgência/prioridade alta
 */
const URGENCY_KEYWORDS = ['risco', 'perigo', 'ameaça', 'urgente', 'emergência', 'violência', 'grave', 'sério'];

/**
 * Palavras-chave que indicam prioridade média
 */
const MEDIUM_PRIORITY_KEYWORDS = ['demora', 'fila', 'atraso', 'não resolveu', 'reclamação', 'insatisfeito', 'problema'];

/**
 * Regex para detecção de dados pessoais
 */
const PRIVACY_PATTERNS = {
    cpf: /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/g,
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    phone: /\b(?:\+55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}\b/g,
    rg: /\brg[:\s]?\d{1,2}\.?\d{3}\.?\d{3}-?[0-9xX]\b/gi,
    address: /\b(?:rua|av\.|avenida|quadra|sq)\s+[^\s]+\s*,?\s*\d+/gi
};

/**
 * Normaliza texto para matching
 */
const normalizeText = (text) => {
    if (!text) return '';
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .trim();
};

/**
 * Conta matches de keywords no texto
 */
const countMatches = (text, keywords) => {
    if (!text || !keywords) return { score: 0, matches: [] };

    const normalizedText = normalizeText(text);
    let score = 0;
    const matches = [];

    // Strong keywords (peso 3)
    keywords.strong?.forEach(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedText.includes(normalizedKeyword)) {
            score += 3;
            matches.push(keyword);
        }
    });

    // Medium keywords (peso 2)
    keywords.medium?.forEach(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedText.includes(normalizedKeyword)) {
            score += 2;
            matches.push(keyword);
        }
    });

    // Weak keywords (peso 1)
    keywords.weak?.forEach(keyword => {
        const normalizedKeyword = normalizeText(keyword);
        if (normalizedText.includes(normalizedKeyword)) {
            score += 1;
            matches.push(keyword);
        }
    });

    return { score, matches };
};

/**
 * Detecta se há dados pessoais no texto
 */
const detectPrivacyIssues = (text) => {
    if (!text) return false;

    for (const [type, pattern] of Object.entries(PRIVACY_PATTERNS)) {
        if (pattern.test(text)) {
            return true;
        }
    }

    return false;
};

/**
 * Determina prioridade baseada em keywords de urgência
 */
const determinePriority = (text) => {
    if (!text) return IZAPriority.LOW;

    const normalizedText = normalizeText(text);

    // Verifica urgência alta
    for (const keyword of URGENCY_KEYWORDS) {
        if (normalizedText.includes(normalizeText(keyword))) {
            return IZAPriority.HIGH;
        }
    }

    // Verifica prioridade média
    for (const keyword of MEDIUM_PRIORITY_KEYWORDS) {
        if (normalizedText.includes(normalizeText(keyword))) {
            return IZAPriority.MEDIUM;
        }
    }

    return IZAPriority.LOW;
};

/**
 * Extrai tags relevantes do texto
 */
const extractTags = (text, matches) => {
    const tags = new Set();

    // Adiciona matches únicos
    matches.forEach(match => {
        if (match.length > 3) { // Apenas palavras com 4+ caracteres
            tags.add(match.charAt(0).toUpperCase() + match.slice(1));
        }
    });

    // Limita a 6 tags
    return Array.from(tags).slice(0, 6);
};

/**
 * Simula delay de rede (600-1100ms)
 */
const simulateDelay = () => {
    const min = 600;
    const max = 1100;
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Classifica manifestação usando IA IZA (Mock)
 * 
 * @param {IZAInput} input - Dados da manifestação
 * @returns {Promise<IZAResult>} Resultado da classificação
 */
export const classifyWithIZA = async (input) => {
    // Simula latência de rede
    await simulateDelay();

    // Combina todos os textos disponíveis
    const fullText = [
        input.text,
        input.transcript,
        input.userProvidedDescription
    ].filter(Boolean).join(' ');

    if (!fullText.trim()) {
        // Fallback para entrada vazia
        return {
            category: IZACategory.GENERAL,
            suggestedAgency: IZAAgency.GENERAL,
            tags: ['Sem categorização'],
            priority: IZAPriority.LOW,
            privacyAlert: false,
            confidence: 0.30,
            rationale: 'Não foi possível classificar devido à ausência de conteúdo textual.'
        };
    }

    // Classifica por categoria
    let bestMatch = null;
    let bestScore = 0;
    let allMatches = [];

    for (const [key, categoryData] of Object.entries(KEYWORDS_DICTIONARY)) {
        const { score, matches } = countMatches(fullText, categoryData.keywords);

        if (score > bestScore) {
            bestScore = score;
            bestMatch = categoryData;
            allMatches = matches;
        }
    }

    // Fallback se nenhuma categoria foi identificada
    if (!bestMatch || bestScore === 0) {
        return {
            category: IZACategory.GENERAL,
            suggestedAgency: IZAAgency.GENERAL,
            tags: extractTags(fullText, []),
            priority: determinePriority(fullText),
            privacyAlert: detectPrivacyIssues(fullText),
            confidence: 0.55,
            rationale: 'Classificação genérica. Recomenda-se análise manual pela Ouvidoria-Geral.'
        };
    }

    // Determina confidence baseada no score
    let confidence;
    if (bestScore >= 5) {
        confidence = 0.85;
    } else if (bestScore >= 2) {
        confidence = 0.70;
    } else {
        confidence = 0.60;
    }

    // Detecção de privacidade
    const privacyAlert = detectPrivacyIssues(fullText);

    // Prioridade
    const priority = determinePriority(fullText);

    // Tags
    const tags = extractTags(fullText, allMatches);

    // Rationale
    let rationale = `Classificado como "${bestMatch.category}" com base em ${allMatches.length} indicador(es) identificado(s).`;

    if (priority === IZAPriority.HIGH) {
        rationale += ' Prioridade ALTA devido a indícios de urgência.';
    }

    if (privacyAlert) {
        rationale += ' ATENÇÃO: Possível presença de dados pessoais; recomenda-se tratamento não público e ocultação de informações sensíveis.';
    }

    return {
        category: bestMatch.category,
        suggestedAgency: bestMatch.agency,
        tags,
        priority,
        privacyAlert,
        confidence: parseFloat(confidence.toFixed(2)),
        rationale
    };
};

/**
 * Ajusta órgão específico para serviços urbanos
 * (Refinamento baseado em palavras específicas)
 */
const refineUrbanAgency = (text) => {
    const normalized = normalizeText(text);

    if (normalized.includes('lixo') || normalized.includes('entulho')) {
        return IZAAgency.SLU;
    }

    if (normalized.includes('buraco') || normalized.includes('asfalto') || normalized.includes('iluminacao')) {
        return IZAAgency.NOVACAP;
    }

    if (normalized.includes('agua') || normalized.includes('esgoto')) {
        return IZAAgency.CAESB;
    }

    return IZAAgency.SLU; // Default
};
