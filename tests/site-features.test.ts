import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

import {
  parseGivingLinks,
  parseHttpsUrl,
  parseImpactFigures,
  parseRegistrationYear,
  parseSponsorshipPackages,
  serializeImpactFigures,
  serializeSponsorshipPackages,
} from '../lib/site-content-parse';
import { fromMinorUnits, toMinorUnits, verifyWebhookSignature } from '../lib/paystack';
import { unsubscribeToken, unsubscribeUrl, verifyUnsubscribeToken } from '../lib/unsubscribe';

test('parses impact figures, with and without period and source', () => {
  const figures = parseImpactFigures(
    ['150,000 | Young people reached', '40 | institutions engaged | 2017–2025 | Attendance records', '', 'broken line'].join('\n')
  );
  assert.deepEqual(figures, [
    { value: '150,000', label: 'Young people reached' },
    { value: '40', label: 'institutions engaged', period: '2017–2025', source: 'Attendance records' },
  ]);
});

test('impact figures survive a save and reload round trip', () => {
  const text = '12,500 | Young people reached | 2017–2025 | Beneficiary records\n30 | Communities served';
  assert.equal(serializeImpactFigures(parseImpactFigures(text)), text);
});

test('parses sponsorship packages and their benefits', () => {
  const packages = parseSponsorshipPackages(
    'Programme Supporter | ₦250,000 | Logo on materials; Impact report\nNo amount here |'
  );
  assert.deepEqual(packages, [
    { name: 'Programme Supporter', amount: '₦250,000', benefits: ['Logo on materials', 'Impact report'] },
  ]);
  assert.equal(
    serializeSponsorshipPackages(packages),
    'Programme Supporter | ₦250,000 | Logo on materials; Impact report'
  );
});

test('registration year accepts a plausible year only', () => {
  assert.equal(parseRegistrationYear('2021'), 2021);
  assert.equal(parseRegistrationYear(' 2022 '), 2022);
  assert.equal(parseRegistrationYear(''), null);
  assert.equal(parseRegistrationYear('1999'), null);
  assert.equal(parseRegistrationYear('3000'), null);
  assert.equal(parseRegistrationYear('20x1'), null);
});

test('converts donation amounts to and from the smallest currency unit', () => {
  assert.equal(toMinorUnits(5000), 500000);
  assert.equal(toMinorUnits(2500.5), 250050);
  assert.equal(toMinorUnits(0.1 + 0.2), 30); // floating point is rounded, not truncated
  assert.equal(fromMinorUnits(500000), 5000);
});

test('accepts a correctly signed Paystack webhook and rejects tampering', () => {
  const key = 'sk_test_example_key';
  const body = JSON.stringify({ event: 'charge.success', data: { reference: 'abc123', amount: 500000 } });
  const signature = createHmac('sha512', key).update(body).digest('hex');

  assert.equal(verifyWebhookSignature(body, signature, key), true);
  assert.equal(verifyWebhookSignature(body + ' ', signature, key), false); // body changed
  assert.equal(verifyWebhookSignature(body, signature, 'another_key'), false); // wrong key
  assert.equal(verifyWebhookSignature(body, null, key), false);
  assert.equal(verifyWebhookSignature(body, 'not-hex', key), false);
});

test('unsubscribe links are signed per address and cannot be reused for another', () => {
  process.env.AUTH_SECRET = 'test-signing-secret';
  process.env.NEXT_PUBLIC_SITE_URL = 'https://example.org';

  const token = unsubscribeToken('Person@Example.com');
  assert.ok(token && token.length === 64);
  assert.equal(verifyUnsubscribeToken('person@example.com', token!), true); // case-insensitive address
  assert.equal(verifyUnsubscribeToken('someone.else@example.com', token!), false);
  assert.equal(verifyUnsubscribeToken('person@example.com', 'f'.repeat(64)), false);
  assert.equal(verifyUnsubscribeToken('person@example.com', 'short'), false);

  const url = unsubscribeUrl('person@example.com');
  assert.ok(url?.startsWith('https://example.org/unsubscribe?email=person%40example.com&token='));
});

test('giving links keep only named https payment pages', () => {
  const links = parseGivingLinks(
    [
      'Project 300 | https://paystack.com/pay/ytop-project-300',
      'Food4All | http://insecure.example/pay',
      'No link |',
      '| https://paystack.com/pay/no-name',
      'Boundless Generosity | https://paystack.com/pay/boundless',
    ].join('\n')
  );
  assert.deepEqual(links, [
    { label: 'Project 300', url: 'https://paystack.com/pay/ytop-project-300' },
    { label: 'Boundless Generosity', url: 'https://paystack.com/pay/boundless' },
  ]);
});

test('monthly giving link must be a single https URL', () => {
  assert.equal(parseHttpsUrl(' https://paystack.com/pay/ytop-monthly '), 'https://paystack.com/pay/ytop-monthly');
  assert.equal(parseHttpsUrl('http://paystack.com/pay/x'), null);
  assert.equal(parseHttpsUrl('javascript:alert(1)'), null);
  assert.equal(parseHttpsUrl('https://a.com/x y'), null);
  assert.equal(parseHttpsUrl(''), null);
});
