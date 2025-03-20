# GeoBlock

A minimal, yet powerful geoblocking library for game websites. Easily implement country-based access restrictions with predefined presets for different regulatory contexts.

## Features

- 🌎 Multiple geolocation services with fallbacks
- 🛡️ Preset country lists for common regulatory scenarios (gambling, lottery, sanctions)
- 🔧 Flexible configuration options
- 💪 No dependencies
- 📱 Works in all modern browsers
- 🎨 Customizable blocking UI
- ⚡ Lightweight (~5KB minified and gzipped)

## Installation

### NPM

```bash
npm install github:trifle-labs/GeoBlock
```

### Yarn

```bash
yarn add github:trifle-labs/GeoBlock
```

### Direct script include

```html
<script src="https://unpkg.com/github:trifle-labs/GeoBlock/dist/geoblock.min.js"></script>
```

## Basic Usage

```javascript
// Import the library
import GeoBlock from 'geoblock';

// Create a new instance with default options
const geoblock = new GeoBlock({
  activePresets: ['gambling'], // Use the gambling preset
  additionalCountries: ['BR', 'AR'], // Add more countries
  exemptCountries: ['CA'], // Exempt specific countries
});

// Check if the user should be blocked and apply visual blocking if needed
geoblock.checkAndBlock().then((hasAccess) => {
  if (hasAccess) {
    console.log('User has access');
    // Initialize your app here
  } else {
    console.log('User is blocked');
  }
});
```

## Available Presets

The library includes the following built-in presets:

- `sanctions`: Countries under international sanctions
- `gambling`: Countries with strict gambling regulations
- `lottery`: Countries with strict lottery regulations
- `raffle`: Countries with raffle restrictions

## Configuration Options

```javascript
const geoblock = new GeoBlock({
  // Presets
  presets: {
    // Override or add custom presets
    custom: ['FR', 'DE', 'IT'],
  },

  // Which presets to apply (can use multiple)
  activePresets: ['gambling', 'custom'],

  // Additional individual countries to block (2-letter country codes)
  additionalCountries: ['BR', 'AR'],

  // Countries to exempt from blocking
  exemptCountries: ['CA'],

  // Blocking message (supports {country} and {countryCode} placeholders)
  blockMessage: "We're sorry, access to this site is restricted in {country}.",

  // Visual blocking settings
  visualBlocking: true,
  blockingClass: 'geo-blocked',
  overlayClass: 'geo-overlay',
  messageClass: 'geo-message',

  // Dismissal options
  allowDismiss: true, // Whether to show the X button to dismiss the notice
  dismissOnOverlayClick: true, // Whether clicking the background dismisses the notice

  // Custom styles for visual elements
  customStyles: {
    overlay: {
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      backdropFilter: 'blur(5px)',
    },
    message: {
      backgroundColor: '#222',
      color: 'white',
      borderRadius: '20px',
    },
    closeButton: {
      color: '#fff',
      fontSize: '28px',
    },
  },

  // Testing settings
  testMode: false,
  testCountry: null, // Set to a country code to simulate that location
});
```

## API Reference

### Constructor

```javascript
const geoblock = new GeoBlock(options);
```

### Methods

- `async getCountryInfo()`: Gets information about the user's country
- `async checkAccess()`: Checks if the user should be blocked
- `async checkAndBlock()`: Checks access and applies visual blocking if needed
- `applyVisualBlocking(countryData)`: Manually applies visual blocking
- `removeVisualBlocking()`: Removes visual blocking elements
- `getBlockedCountries()`: Gets the complete list of blocked countries
- `getPreset(presetName)`: Gets the country list for a specific preset

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build: `npm run build`
5. Run example: `npm run serve` (opens the example in your browser)

## License

MIT
