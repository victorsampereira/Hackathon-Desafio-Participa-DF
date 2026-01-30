/**
 * Testes básicos para o serviço IZA
 * Executar com: npm test src/services/__tests__/izaService.test.js
 */

import { describe, it, expect } from 'vitest';
import { classifyWithIZA } from '../izaService';

describe('IZA Classification Service', () => {
    it('deve classificar "upa" como Saúde', async () => {
        const input = {
            channel: 'text',
            text: 'Estive na UPA de Ceilândia e fui mal atendido',
            anonymous: true
        };

        const result = await classifyWithIZA(input);

        expect(result.category).toBe('Saúde');
        expect(result.suggestedAgency).toBe('Secretaria de Saúde do DF');
        expect(result.confidence).toBeGreaterThan(0.6);
    });

    it('deve detectar e-mail e marcar privacyAlert', async () => {
        const input = {
            channel: 'text',
            text: 'Meu e-mail é teste@example.com. Preciso de ajuda com iluminação.',
            anonymous: false
        };

        const result = await classifyWithIZA(input);

        expect(result.privacyAlert).toBe(true);
        expect(result.rationale).toContain('dados pessoais');
    });

    it('deve detectar CPF e marcar privacyAlert', async () => {
        const input = {
            channel: 'text',
            text: 'Meu CPF é 123.456.789-00',
            anonymous: false
        };

        const result = await classifyWithIZA(input);

        expect(result.privacyAlert).toBe(true);
    });

    it('deve usar fallback para Ouvidoria-Geral quando nenhum match', async () => {
        const input = {
            channel: 'text',
            text: 'Gostaria de enviar um elogio',
            anonymous: true
        };

        const result = await classifyWithIZA(input);

        expect(result.category).toBe('Atendimento ao Cidadão');
        expect(result.suggestedAgency).toBe('Ouvidoria-Geral do DF');
        expect(result.confidence).toBeLessThan(0.7);
    });

    it('deve retornar fallback para entrada vazia', async () => {
        const input = {
            channel: 'text',
            text: '',
            anonymous: true
        };

        const result = await classifyWithIZA(input);

        expect(result.category).toBe('Atendimento ao Cidadão');
        expect(result.confidence).toBe(0.30);
    });

    it('deve identificar prioridade ALTA para emergência', async () => {
        const input = {
            channel: 'text',
            text: 'URGENTE: Há risco de desabamento na escola',
            anonymous: false
        };

        const result = await classifyWithIZA(input);

        expect(result.priority).toBe('ALTA');
    });

    it('deve classificar manifestação sobre transporte', async () => {
        const input = {
            channel: 'text',
            text: 'O ônibus da linha 0.100 está com atraso de 40 minutos na parada do metrô',
            anonymous: true
        };

        const result = await classifyWithIZA(input);

        expect(result.category).toBe('Transporte e Mobilidade');
        expect(result.suggestedAgency).toBe('Secretaria de Transporte e Mobilidade do DF');
    });

    it('deve extrair tags relevantes', async () => {
        const input = {
            channel: 'text',
            text: 'Problemas com lixo acumulado e buraco na rua',
            anonymous: true
        };

        const result = await classifyWithIZA(input);

        expect(result.tags).toBeInstanceOf(Array);
        expect(result.tags.length).toBeGreaterThan(0);
        expect(result.tags.length).toBeLessThanOrEqual(6);
    });

    it('deve retornar confidence entre 0 e 1', async () => {
        const input = {
            channel: 'text',
            text: 'Teste qualquer',
            anonymous: true
        };

        const result = await classifyWithIZA(input);

        expect(result.confidence).toBeGreaterThanOrEqual(0);
        expect(result.confidence).toBeLessThanOrEqual(1);
        // Deve ter 2 casas decimais
        expect(result.confidence.toString()).toMatch(/^\d\.\d{2}$/);
    });
});
