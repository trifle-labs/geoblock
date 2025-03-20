/**
 * This file demonstrates how to use GeoBlock with Vite
 *
 * In a real Vite project, you would:
 * 1. Install the package: npm install github:trifle-labs/GeoBlock
 * 2. Import it as shown below
 */

// ESM import for Vite
import GeoBlock from 'geoblock';

// Example usage
const initGeoBlock = async () => {
  const geoblock = new GeoBlock({
    activePresets: ['gambling'],
    blockMessage:
      'Access from your country is restricted due to local regulations.',
  });

  // Check access and block if needed
  const hasAccess = await geoblock.checkAndBlock();

  if (hasAccess) {
    console.log('User has access to the site');
    // Initialize your app
  } else {
    console.log('User is blocked');
    // The block screen is already displayed
  }
};

// Initialize
initGeoBlock();
