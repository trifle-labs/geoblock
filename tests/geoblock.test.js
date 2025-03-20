/**
 * @jest-environment jsdom
 */

import GeoBlock from '../src/geoblock.js';

// Mock fetch for testing
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        country_code: 'US',
        country_name: 'United States',
        ip: '1.2.3.4',
      }),
  })
);

describe('GeoBlock', () => {
  beforeEach(() => {
    // Clear all DOM elements and reset fetch mock
    document.body.innerHTML = '';
    fetch.mockClear();
  });

  test('should initialize with default options', () => {
    const geoblock = new GeoBlock();
    expect(geoblock.presets).toBeDefined();
    expect(geoblock.presets.gambling).toContain('US');
    expect(geoblock.config.visualBlocking).toBe(true);
    expect(geoblock.blockedCountries).toEqual([]);
  });

  test('should initialize with custom presets and options', () => {
    const geoblock = new GeoBlock({
      presets: {
        custom: ['FR', 'DE', 'IT'],
      },
      activePresets: ['custom'],
      additionalCountries: ['UK'],
      exemptCountries: ['IT'],
      blockMessage: 'Custom message',
    });

    expect(geoblock.presets.custom).toEqual(['FR', 'DE', 'IT']);
    expect(geoblock.config.blockMessage).toBe('Custom message');
    expect(geoblock.blockedCountries).toContain('FR');
    expect(geoblock.blockedCountries).toContain('DE');
    expect(geoblock.blockedCountries).toContain('UK');
    expect(geoblock.blockedCountries).not.toContain('IT');
  });

  test('should correctly use testMode', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'JP',
      activePresets: ['gambling'],
    });

    const result = await geoblock.checkAccess();
    expect(result.countryCode).toBe('JP');
    expect(result.isBlocked).toBe(true);
    expect(fetch).not.toHaveBeenCalled();
  });

  test('should apply visual blocking', async () => {
    const geoblock = new GeoBlock({
      activePresets: ['gambling'],
      testMode: true,
      testCountry: 'US',
    });

    await geoblock.checkAndBlock();

    expect(document.body.classList.contains('geo-blocked')).toBe(true);
    expect(document.querySelector('.geo-overlay')).not.toBeNull();
    expect(document.querySelector('.geo-message')).not.toBeNull();
  });

  test('should not block non-restricted countries', async () => {
    const geoblock = new GeoBlock({
      activePresets: ['gambling'],
      testMode: true,
      testCountry: 'LU', // Luxembourg - not in any default preset
    });

    const hasAccess = await geoblock.checkAndBlock();
    expect(hasAccess).toBe(true);
    expect(document.querySelector('.geo-overlay')).toBeNull();
  });

  test('should initialize with custom preset descriptions', () => {
    const geoblock = new GeoBlock({
      presetDescriptions: {
        gambling: 'Custom gambling description',
        customPreset: 'My custom preset description',
      },
      presets: {
        customPreset: ['FR', 'DE', 'IT'],
      },
    });

    expect(geoblock.presetDescriptions.gambling).toBe(
      'Custom gambling description'
    );
    expect(geoblock.presetDescriptions.customPreset).toBe(
      'My custom preset description'
    );
    expect(geoblock.presetDescriptions.lottery).toBeDefined(); // Default descriptions still exist
  });

  test('should correctly track blocking presets in checkAccess results', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'FR',
      presets: {
        europeanMarkets: ['FR', 'DE', 'IT', 'ES'],
        luxuryGoods: ['FR', 'GB', 'IT'],
      },
      presetDescriptions: {
        europeanMarkets: 'European market restrictions',
        luxuryGoods: 'Luxury goods regulations',
      },
      activePresets: ['europeanMarkets', 'luxuryGoods'],
    });

    const result = await geoblock.checkAccess();

    expect(result.isBlocked).toBe(true);
    expect(result.countryCode).toBe('FR');
    expect(result.blockingPresets).toBeDefined();
    expect(result.blockingPresets).toBeInstanceOf(Array);
    expect(result.blockingPresets).toContain('europeanMarkets');
    expect(result.blockingPresets).toContain('luxuryGoods');
    expect(result.blockingPresets.length).toBe(2);
  });

  test('should correctly identify which built-in presets are blocking a country', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'US',
      activePresets: ['gambling', 'lottery', 'raffle'],
    });

    const result = await geoblock.checkAccess();

    expect(result.isBlocked).toBe(true);
    expect(result.blockingPresets).toContain('gambling');
    expect(result.blockingPresets).toContain('lottery');
    expect(result.blockingPresets).toContain('raffle');
    expect(result.blockingPresets.length).toBe(3);
  });

  test('should not include non-blocking presets in the blockingPresets array', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'US', // US is in gambling, lottery and raffle, but not sanctions
      activePresets: ['gambling', 'sanctions'],
    });

    const result = await geoblock.checkAccess();

    expect(result.isBlocked).toBe(true);
    expect(result.blockingPresets).toContain('gambling');
    expect(result.blockingPresets).not.toContain('sanctions');
    expect(result.blockingPresets.length).toBe(1);
  });

  test('should include custom preset descriptions in block message', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'FR',
      presets: {
        europeanRestrictions: ['FR', 'DE', 'IT'],
      },
      presetDescriptions: {
        europeanRestrictions: 'European regulatory restrictions',
      },
      activePresets: ['europeanRestrictions'],
      visualBlocking: true,
      legalEntity: 'Test Gaming Company',
    });

    await geoblock.checkAndBlock();

    const messageEl = document.querySelector('.geo-message');
    expect(messageEl).not.toBeNull();
    expect(messageEl.innerHTML).toContain('European regulatory restrictions');
    expect(messageEl.innerHTML).toContain('Test Gaming Company');
  });

  test('should format block message with multiple preset descriptions', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'US',
      presets: {
        usRestrictions: ['US', 'CA'],
        ageVerification: ['US', 'GB', 'AU'],
      },
      presetDescriptions: {
        usRestrictions: 'United States regulatory restrictions',
        ageVerification: 'Age verification requirements',
      },
      activePresets: ['usRestrictions', 'ageVerification'],
    });

    await geoblock.checkAndBlock();

    const messageEl = document.querySelector('.geo-message');
    expect(messageEl).not.toBeNull();
    expect(messageEl.innerHTML).toContain(
      'United States regulatory restrictions'
    );
    expect(messageEl.innerHTML).toContain('Age verification requirements');
    // Updated expectations to match the actual HTML structure
    expect(messageEl.innerHTML).toContain('Restriction Types');
    expect(messageEl.innerHTML).toContain('<ul style=');
    expect(messageEl.innerHTML).toContain('<li>');
  });

  test('should allow custom preset without description and use preset name as fallback', async () => {
    const geoblock = new GeoBlock({
      testMode: true,
      testCountry: 'JP',
      presets: {
        asianMarkets: ['JP', 'CN', 'KR'],
      },
      // No description provided for asianMarkets
      activePresets: ['asianMarkets'],
    });

    const result = await geoblock.checkAccess();

    expect(result.isBlocked).toBe(true);
    expect(result.blockingPresets).toContain('asianMarkets');

    await geoblock.checkAndBlock();

    const messageEl = document.querySelector('.geo-message');
    // Should use the preset name as a fallback
    expect(messageEl.innerHTML).toContain('asianMarkets');
  });
});
