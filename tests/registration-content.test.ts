import test from 'node:test';
import assert from 'node:assert/strict';
import { registrationContent } from '../lib/commerce/registration-content';
import type { Registration } from '../lib/commerce/store';

test('approved LL01 content and in-person instructions stay specific to workshop', () => {
  for (const workshop of ['LL01', 'W01', 'EL01'] as const) {
    for (const amount_minor of [500, 24900]) {
      const text = registrationContent({ workshop, amount_minor, name: 'Ana Teste' } as Registration, 'TICKET');
      assert.ok(text.includes('incrição') || text.includes('inscrição') || text.includes('garantida'));
      assert.ok(workshop === 'LL01' ? text.includes('AUTOMAÇÃO COM PESSOAS NO CENTRO') : text.includes(workshop));
      assert.equal(text.includes('BILHETE DE TESTE'), amount_minor === 500);
      assert.ok(text.includes('https://wa.me/5562991903462'));
      if (workshop === 'LL01') {
        for (const phrase of ['100% ONLINE', '27 e 29 de outubro de 2026', 'Sérgio Monteiro',
          'EMPRESA AUMENTADA', 'em breve',
          'Em breve, vamos enviar-lhe todas as informações']) assert.ok(text.includes(phrase));
      } else {
        assert.ok(text.includes('presencial'));
        assert.ok(!/live|ONLINE|livro/.test(text));
      }
    }
  }
});
