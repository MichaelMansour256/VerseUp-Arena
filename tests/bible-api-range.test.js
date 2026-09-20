import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load bible-api.js as a classic script (same pattern as bible-api.test.js).
const apiCode = fs.readFileSync(
    path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'js/services/bible-api.js'),
    'utf8'
);

globalThis.document = { querySelectorAll: () => [], querySelector: () => null, createElement: () => ({ remove: () => {}, style: {} }) };
globalThis.fetch = () => Promise.resolve({ ok: true, json: async () => ({}) });
vm.runInThisContext(`${apiCode}\n;\nglobalThis.__rangeAPI = bibleAPI;`, { filename: 'bible-api.js' });
const bibleAPI = globalThis.__rangeAPI;

// Generic fixture — nothing Psalm-91-specific about the implementation;
// Psalm 91 is just one of several chapters exercised here.
const rangeBibleData = {
    books: [
        { name: 'Psalms', name_ar: 'المزامير', abbreviation: 'psalms', chapters: [
            { chapter: 91, verses: Array.from({ length: 16 }, (_, i) => ({ verse: i + 1, text: `text 91:${i + 1}` })) },
            { chapter: 23, verses: Array.from({ length: 6 }, (_, i) => ({ verse: i + 1, text: `text 23:${i + 1}` })) },
        ]},
        { name: 'John', name_ar: 'يوحنا', abbreviation: 'john', chapters: [
            { chapter: 3, verses: Array.from({ length: 21 }, (_, i) => ({ verse: i + 1, text: `text 3:${i + 1}` })) },
        ]},
        { name: 'Gap', name_ar: 'فجوة', abbreviation: 'gap', chapters: [
            { chapter: 1, verses: [{ verse: 1, text: 'a' }, { verse: 3, text: 'c' }] },
        ]},
    ],
};

describe('BibleAPI multi-verse range (generic, consecutive, same chapter)', () => {
    test('getChapterVerseNumbers lists verses dynamically (Ps 91 has 16)', () => {
        assert.deepEqual(
            bibleAPI.getChapterVerseNumbers(rangeBibleData, 'psalms', 91),
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        );
    });

    test('getVerseRange 91:1-3 returns 3 texts in biblical order, untouched', () => {
        const verses = bibleAPI.getVerseRange(rangeBibleData, 'psalms', 91, 1, 3);
        assert.equal(verses.length, 3);
        assert.deepEqual(verses.map(v => v.verse), [1, 2, 3]);
        assert.equal(verses[0].text, 'text 91:1');
        assert.equal(verses[2].text, 'text 91:3');
    });

    test('middle range 91:5-8 and ending range 91:14-16', () => {
        assert.deepEqual(bibleAPI.getVerseRange(rangeBibleData, 'psalms', 91, 5, 8).map(v => v.verse), [5, 6, 7, 8]);
        assert.deepEqual(bibleAPI.getVerseRange(rangeBibleData, 'psalms', 91, 14, 16).map(v => v.verse), [14, 15, 16]);
    });

    test('two-verse range 91:1-2', () => {
        assert.deepEqual(bibleAPI.getVerseRange(rangeBibleData, 'psalms', 91, 1, 2).map(v => v.verse), [1, 2]);
    });

    test('works for other books: John 3:16-18 and Ps 23:1-4', () => {
        assert.deepEqual(bibleAPI.getVerseRange(rangeBibleData, 'john', 3, 16, 18).map(v => v.verse), [16, 17, 18]);
        assert.deepEqual(bibleAPI.getVerseRange(rangeBibleData, 'psalms', 23, 1, 4).map(v => v.verse), [1, 2, 3, 4]);
    });

    test('returns null when range exceeds chapter (91:15-20)', () => {
        assert.equal(bibleAPI.getVerseRange(rangeBibleData, 'psalms', 91, 15, 20), null);
    });

    test('validateVerseRange accepts single verse, middle, ending, and full chapter', () => {
        assert.equal(bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, 1, 1).valid, true);
        assert.equal(bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, 5, 8).valid, true);
        assert.equal(bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, 14, 16).valid, true);
        assert.equal(bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, 1, 16).valid, true);
    });

    test('validateVerseRange rejects reversed / out-of-range / gap / empty', () => {
        const reversed = bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, 5, 3);
        assert.equal(reversed.valid, false);
        assert.equal(reversed.reason, 'reversed');
        const over = bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, 15, 20);
        assert.equal(over.valid, false);
        assert.equal(over.reason, 'out-of-range');
        const gap = bibleAPI.validateVerseRange(rangeBibleData, 'gap', 1, 1, 3);
        assert.equal(gap.valid, false);
        assert.equal(gap.reason, 'gap');
        assert.equal(bibleAPI.validateVerseRange(rangeBibleData, 'psalms', 91, '', '').valid, false);
    });

    test('formatArabicRangeReference: single verse collapses to legacy format', () => {
        assert.equal(
            bibleAPI.formatArabicRangeReference('مزمور', 91, 1, 1),
            bibleAPI.formatArabicReference('مزمور', 91, 1)
        );
    });

    test('formatArabicRangeReference: multi-verse uses ch:start-end Arabic digits', () => {
        const stripBidi = (s) => String(s).replace(/[\u202A-\u202E\u2066-\u2069\u200E\u200F]/g, '');
        assert.equal(stripBidi(bibleAPI.formatArabicRangeReference('مزمور', 91, 1, 3)), 'مزمور ٩١:١-٣');
        assert.equal(stripBidi(bibleAPI.formatArabicRangeReference('يوحنا', 3, 16, 18)), 'يوحنا ٣:١٦-١٨');
    });

    test('formatArabicRangeReference: wraps digits in bidi isolates so canvas cannot mirror them', () => {
        const ref = bibleAPI.formatArabicRangeReference('مزمور', 91, 1, 3);
        assert.ok(ref.includes(String.fromCharCode(8294)), 'expected LRI isolate U+2066');
        assert.ok(ref.includes(String.fromCharCode(8297)), 'expected PDI isolate U+2069');
    });
});
