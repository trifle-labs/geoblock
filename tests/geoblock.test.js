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
});
