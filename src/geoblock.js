/**
 * GeoBlock.js - A minimal geoblocking library for game websites
 *
 * This library provides functions to implement country-based access restrictions
 * with predefined presets for different regulatory contexts.
 */

class GeoBlock {
  constructor(options = {}) {
    // Country presets
    this.presets = {
      // Countries under international sanctions
      // including but not limited to Cuba, Iran, North Korea, Syria, Venezuela, the Crimea region of Ukraine, and the so-called Donetsk People's Republic and Luhansk People's Republic regions of Ukraine (collectively, "Sanctioned Territories"); (ii) they are not identified on any sanctions-related list of designated persons, including but not limited to the U.S. Treasury Department's Specially Designated Nationals List, the EU's Consolidated List of Persons, Groups and Entities Subject to EU Financial Sanctions, or the UK's Consolidated List of Financial Sanctions Targets (collectively, "Sanctions Lists")
      sanctions: [
        'CU', // Cuba
        'IR', // Iran
        'KP', // North Korea
        'SY', // Syria
        'VE', // Venezuela
        'CR', // Crimea Region
        'UA', // Ukraine
        'RU', // Russia
        'BY', // Belarus
        'KR', // South Korea
      ],

      // Countries with strict gambling regulations
      // China, Singapore, United Arab Emirates, Saudi Arabia, Qatar, Brunei, Iran, North Korea, Japan, South Korea, Thailand, Indonesia, Malaysia, Vietnam, India (varies by state), Pakistan, Afghanistan, Turkey, Egypt, Cambodia, Russia, Ukraine, Cyprus, Poland, Greece, Norway, Finland, Iceland, Australia, Brazil, Argentina, Colombia, Peru, Chile, Morocco, Algeria, Tunisia, Lebanon, Israel, Jordan, Kuwait, Bahrain, Oman, Yemen, Bangladesh, Philippines, New Zealand, France, Germany, Italy, Spain, Portugal, Netherlands, Switzerland, Austria, United States (varies by state), Canada (varies by province)
      gambling: [
        'US', // United States
        'CN', // China
        'SG', // Singapore
        'AE', // United Arab Emirates
        'SA', // Saudi Arabia
        'QA', // Qatar
        'BN', // Brunei
        'IR', // Iran
        'KP', // North Korea
        'JP', // Japan
        'KR', // South Korea
        'TH', // Thailand
        'ID', // Indonesia
        'MY', // Malaysia
        'VN', // Vietnam
        'IN', // India
        'PK', // Pakistan
        'AF', // Afghanistan
        'TR', // Turkey
        'EG', // Egypt
        'KH', // Cambodia
        'RU', // Russia
        'UA', // Ukraine
        'CY', // Cyprus
        'PL', // Poland
        'GR', // Greece
        'NO', // Norway
        'FI', // Finland
        'IS', // Iceland
        'AU', // Australia
        'BR', // Brazil
        'AR', // Argentina
        'CO', // Colombia
        'PE', // Peru
        'CL', // Chile
        'MA', // Morocco
        'DZ', // Algeria
        'TN', // Tunisia
        'LB', // Lebanon
        'IL', // Israel
        'JO', // Jordan
        'KW', // Kuwait
        'BH', // Bahrain
        'OM', // Oman
        'YE', // Yemen
        'BD', // Bangladesh
        'PH', // Philippines
        'NZ', // New Zealand
        'FR', // France
        'DE', // Germany
        'IT', // Italy
        'ES', // Spain
        'PT', // Portugal
        'NL', // Netherlands
        'CH', // Switzerland
        'AT', // Austria
        'CA', // Canada
      ],

      // Countries with strict lottery regulations
      // United States (varies by state), China, Japan, South Korea, Singapore, Indonesia, Malaysia, Thailand, United Arab Emirates, Saudi Arabia, Qatar, Brunei, Iran, Yemen, Pakistan, Afghanistan, Algeria, Libya, North Korea, Cambodia, Vietnam, Russia, Ukraine, Turkey, Egypt, Morocco, India (varies by state), Brazil, Argentina, Venezuela, Poland, Hungary, Italy, Norway, Iceland
      lottery: [
        'US', // United States
        'CN', // China
        'JP', // Japan
        'KR', // South Korea
        'SG', // Singapore
        'ID', // Indonesia
        'MY', // Malaysia
        'TH', // Thailand
        'AE', // United Arab Emirates
        'SA', // Saudi Arabia
        'QA', // Qatar
        'BN', // Brunei
        'IR', // Iran
        'YE', // Yemen
        'PK', // Pakistan
        'AF', // Afghanistan
        'DZ', // Algeria
        'LY', // Libya
        'KP', // North Korea
        'KH', // Cambodia
        'VN', // Vietnam
        'RU', // Russia
        'UA', // Ukraine
        'TR', // Turkey
        'EG', // Egypt
        'MA', // Morocco
        'IN', // India
        'BR', // Brazil
        'AR', // Argentina
        'VE', // Venezuela
        'PL', // Poland
        'HU', // Hungary
        'IT', // Italy
        'NO', // Norway
        'IS', // Iceland
      ],

      // Countries with strict sweepstakes regulations
      // Brazil, United Arab Emirates (UAE), Saudi Arabia, Italy, India, Mexico, Qatar, Sweden, Poland, Cayman Islands and any other country or jurisdiction where participation in this Sweepstakes or the distribution of prizes would violate local laws or regulations
      sweepstakes: [
        'BR', // Brazil
        'AE', // United Arab Emirates
        'SA', // Saudi Arabia
        'IT', // Italy
        'IN', // India
        'MX', // Mexico
        'QA', // Qatar
        'SE', // Sweden
        'PL', // Poland
        'KY', // Cayman Islands
      ],

      // Countries with raffle restrictions
      // United States, China, Japan, Singapore, United Arab Emirates, Saudi Arabia, South Korea, Thailand, Indonesia, Malaysia
      raffle: [
        'US', // United States
        'CN', // China
        'JP', // Japan
        'SG', // Singapore
        'AE', // United Arab Emirates
        'SA', // Saudi Arabia
        'KR', // South Korea
        'TH', // Thailand
        'ID', // Indonesia
        'MY', // Malaysia
      ],
    };

    // Allow custom preset definitions if provided
    if (options.presets && typeof options.presets === 'object') {
      // Overwrite default presets with custom ones
      Object.keys(options.presets).forEach((presetName) => {
        if (Array.isArray(options.presets[presetName])) {
          this.presets[presetName] = [...options.presets[presetName]];
        }
      });
    }

    // Configuration
    this.config = {
      // Which presets to apply
      activePresets: options.activePresets || [],

      // Additional individual countries to block
      additionalCountries: options.additionalCountries || [],

      // Countries to exempt from blocking
      exemptCountries: options.exemptCountries || [],

      // Blocking message options
      blockMessage:
        options.blockMessage ||
        "We're sorry, access to this site is restricted in your region.",

      // Visual blocking options
      visualBlocking:
        options.visualBlocking !== undefined ? options.visualBlocking : true,

      // CSS classes for visual blocking
      blockingClass: options.blockingClass || 'geo-blocked',
      overlayClass: options.overlayClass || 'geo-overlay',
      messageClass: options.messageClass || 'geo-message',

      // Dismiss options
      dismissOnOverlayClick:
        options.dismissOnOverlayClick !== undefined
          ? options.dismissOnOverlayClick
          : true,
      allowDismiss:
        options.allowDismiss !== undefined ? options.allowDismiss : true,

      // Custom styles for visual elements
      customStyles: options.customStyles || {},

      // Override settings for testing
      testMode: options.testMode || false,
      testCountry: options.testCountry || null,
    };

    // Compile the block list once at initialization
    this.blockedCountries = this.compileBlockList();

    // Keep track of last country lookup
    this._lastCountryLookup = null;
  }

  /**
   * Compile the complete list of blocked countries from presets and additional settings
   * @returns {Array} Complete list of countries to block
   */
  compileBlockList() {
    // Start with an empty set to avoid duplicates
    const blockedSet = new Set();

    // Add countries from active presets
    this.config.activePresets.forEach((preset) => {
      if (this.presets[preset]) {
        this.presets[preset].forEach((country) => blockedSet.add(country));
      }
    });

    // Add additional countries
    this.config.additionalCountries.forEach((country) =>
      blockedSet.add(country)
    );

    // Remove exempt countries
    this.config.exemptCountries.forEach((country) =>
      blockedSet.delete(country)
    );

    // Convert to array
    return [...blockedSet];
  }

  /**
   * Get country information using JavaScript only
   * @returns {Promise<Object>} Country data
   */
  async getCountryInfo() {
    // If we have a recent lookup, use it
    if (this._lastCountryLookup) {
      return this._lastCountryLookup;
    }

    // For test mode, return the test country
    if (this.config.testMode && this.config.testCountry) {
      const testData = {
        countryCode: this.config.testCountry,
        country: 'Test Country',
        ip: '0.0.0.0',
      };
      this._lastCountryLookup = testData;
      return testData;
    }

    try {
      // Option 1: Using a free public API (no API key required)
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.error) {
        throw new Error(data.reason || 'API error');
      }

      const countryData = {
        countryCode: data.country_code,
        country: data.country_name,
        ip: data.ip,
      };

      // Store the result
      this._lastCountryLookup = countryData;
      return countryData;
    } catch (error) {
      console.error('GeoBlock: Error fetching country data:', error);

      // Fallback to another service if the first one fails
      try {
        const fallbackResponse = await fetch(
          'https://api.ipify.org?format=json'
        );
        const ipData = await fallbackResponse.json();

        const geoResponse = await fetch(`https://ipinfo.io/${ipData.ip}/json`);
        const geoData = await geoResponse.json();

        const countryData = {
          countryCode: geoData.country,
          country: geoData.country, // This API doesn't provide country name
          ip: ipData.ip,
        };

        this._lastCountryLookup = countryData;
        return countryData;
      } catch (fallbackError) {
        console.error('GeoBlock: Fallback geolocation failed:', fallbackError);

        // Return a safe default that won't block anyone in case all APIs fail
        return {
          countryCode: 'XX',
          country: 'Unknown',
          ip: 'Unknown',
        };
      }
    }
  }

  /**
   * Check if user should be blocked based on their country
   * @returns {Promise<Object>} Result object with isBlocked status and country info
   */
  async checkAccess() {
    // Get country info
    const countryData = await this.getCountryInfo();

    // Check if country is in blocked list
    const isBlocked = this.blockedCountries.includes(countryData.countryCode);

    return {
      isBlocked,
      countryCode: countryData.countryCode,
      country: countryData.country,
      ip: countryData.ip,
    };
  }

  /**
   * Apply visual blocking to the page
   * @param {Object} countryData - Country information
   */
  applyVisualBlocking(countryData) {
    // Add class to body to prevent scrolling
    document.body.classList.add(this.config.blockingClass);

    // Create blur overlay
    const overlay = document.createElement('div');
    overlay.className = this.config.overlayClass;

    // Create message container
    const messageContainer = document.createElement('div');
    messageContainer.className = this.config.messageClass;

    // Create close button (only if dismissal is allowed)
    if (this.config.allowDismiss) {
      const closeButton = document.createElement('div');
      closeButton.innerHTML = '&times;'; // × symbol
      closeButton.className = 'geo-close-btn';
      closeButton.title = 'Close';
      closeButton.addEventListener('click', () => this.removeVisualBlocking());
      messageContainer.appendChild(closeButton);

      // Apply close button styles
      const closeButtonStyles = {
        position: 'absolute',
        top: '10px',
        right: '15px',
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#666',
        cursor: 'pointer',
        lineHeight: '24px',
        width: '24px',
        height: '24px',
        textAlign: 'center',
        borderRadius: '50%',
        transition: 'all 0.2s ease',
      };

      Object.assign(closeButton.style, closeButtonStyles);

      // Apply custom styles if provided
      if (this.config.customStyles.closeButton) {
        Object.assign(closeButton.style, this.config.customStyles.closeButton);
      }

      // Add hover effect for close button
      closeButton.addEventListener('mouseover', () => {
        closeButton.style.color = '#000';
        closeButton.style.backgroundColor = '#f0f0f0';
      });

      closeButton.addEventListener('mouseout', () => {
        closeButton.style.color = '#666';
        closeButton.style.backgroundColor = 'transparent';
      });
    }

    // Create message text
    const message = document.createElement('div');
    message.innerHTML = this.formatBlockMessage(countryData);
    messageContainer.appendChild(message);

    // Apply default styles
    const defaultStyles = {
      body: {
        overflow: 'hidden',
      },
      overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 9998,
        opacity: 0, // Start invisible for transition
      },
      message: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '30px',
        borderRadius: '10px',
        backgroundColor: 'white',
        color: '#333',
        maxWidth: '90%',
        width: '500px',
        textAlign: 'center',
        boxShadow: '0 5px 30px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        overflowY: 'auto', // In case the message is too long
        maxHeight: '80vh', // Limit height to 80% of viewport
        opacity: 0, // Start invisible for transition
      },
    };

    // Apply default styles
    Object.assign(overlay.style, defaultStyles.overlay);
    Object.assign(messageContainer.style, defaultStyles.message);

    // Apply custom styles if provided
    if (this.config.customStyles.overlay) {
      Object.assign(overlay.style, this.config.customStyles.overlay);
    }

    if (this.config.customStyles.message) {
      Object.assign(messageContainer.style, this.config.customStyles.message);
    }

    // Add click handler to overlay for dismissal (if allowed)
    if (this.config.allowDismiss && this.config.dismissOnOverlayClick) {
      overlay.addEventListener('click', () => this.removeVisualBlocking());
      // Prevent clicks on the message from closing
      messageContainer.addEventListener('click', (e) => e.stopPropagation());
    }

    // Add elements to the page
    document.body.appendChild(overlay);
    document.body.appendChild(messageContainer);

    // Small delay to ensure proper rendering
    setTimeout(() => {
      // Force a reflow/repaint to ensure positioning is correct
      overlay.style.opacity = '0';
      messageContainer.style.opacity = '0';

      // Then fade in
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s ease';
        messageContainer.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '1';
        messageContainer.style.opacity = '1';
      }, 10);
    }, 50);
  }

  /**
   * Format the block message with country information
   * @param {Object} countryData - Country information
   * @returns {String} Formatted message
   */
  formatBlockMessage(countryData) {
    let message = this.config.blockMessage;

    // Replace placeholders with actual values
    message = message.replace(/\{country\}/g, countryData.country || 'Unknown');
    message = message.replace(
      /\{countryCode\}/g,
      countryData.countryCode || 'XX'
    );

    // Add the standard VPN notice
    message +=
      '<p style="margin-top: 20px; font-size: 0.9em;">We detected that your country is ' +
      (countryData.country || countryData.countryCode) +
      ' and it is our assumption that visiting this site may be an issue in your region. ' +
      'If you think you are seeing this warning unnecessarily, please ensure you do not have any VPN service running.</p>';

    return message;
  }

  /**
   * Remove visual blocking from the page
   */
  removeVisualBlocking() {
    // Remove class from body
    document.body.classList.remove(this.config.blockingClass);

    // Remove overlay and message elements
    const overlay = document.querySelector('.' + this.config.overlayClass);
    const message = document.querySelector('.' + this.config.messageClass);

    if (overlay) overlay.remove();
    if (message) message.remove();
  }

  /**
   * Check access and apply blocking if needed
   * @returns {Promise<boolean>} Whether the user has access
   */
  async checkAndBlock() {
    const accessResult = await this.checkAccess();

    if (accessResult.isBlocked) {
      if (this.config.visualBlocking) {
        this.applyVisualBlocking(accessResult);
      }
      return false;
    }

    return true;
  }

  /**
   * Get the list of blocked countries
   * @returns {Array} Complete list of blocked country codes
   */
  getBlockedCountries() {
    return [...this.blockedCountries];
  }

  /**
   * Get a specific preset's countries
   * @param {String} presetName - Name of the preset
   * @returns {Array|null} Array of country codes or null if preset doesn't exist
   */
  getPreset(presetName) {
    if (!this.presets[presetName]) {
      return null;
    }
    return [...this.presets[presetName]];
  }
}

// Export for different module systems
export default GeoBlock;
