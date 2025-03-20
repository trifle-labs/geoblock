/**
 * GeoBlock Options Interface
 */
export interface GeoBlockOptions {
  /**
   * Custom preset definitions to override or add to defaults
   */
  presets?: Record<string, string[]>;

  /**
   * Custom descriptions for presets shown in blocking message
   */
  presetDescriptions?: Record<string, string>;

  /**
   * Which presets to apply
   */
  activePresets?: string[];

  /**
   * Additional individual countries to block
   */
  additionalCountries?: string[];

  /**
   * Countries to exempt from blocking
   */
  exemptCountries?: string[];

  /**
   * Blocking message options
   */
  blockMessage?: string;

  /**
   * Legal entity name for liability disclaimer (optional)
   */
  legalEntity?: string;

  /**
   * Visual blocking options
   */
  visualBlocking?: boolean;

  /**
   * CSS class for body when blocked
   */
  blockingClass?: string;

  /**
   * CSS class for overlay element
   */
  overlayClass?: string;

  /**
   * CSS class for message element
   */
  messageClass?: string;

  /**
   * Allow dismissal of the blocking message with close button
   */
  allowDismiss?: boolean;

  /**
   * Allow dismissal when clicking on the overlay background
   */
  dismissOnOverlayClick?: boolean;

  /**
   * Custom styles for visual elements
   */
  customStyles?: {
    overlay?: Partial<CSSStyleDeclaration>;
    message?: Partial<CSSStyleDeclaration>;
    closeButton?: Partial<CSSStyleDeclaration>;
  };

  /**
   * Override settings for testing
   */
  testMode?: boolean;

  /**
   * Test country code for testing
   */
  testCountry?: string | null;
}

/**
 * Country information interface
 */
export interface CountryInfo {
  /**
   * ISO country code
   */
  countryCode: string;

  /**
   * Country name
   */
  country: string;

  /**
   * IP address
   */
  ip: string;
}

/**
 * Access check result interface
 */
export interface AccessResult extends CountryInfo {
  /**
   * Whether the user is blocked
   */
  isBlocked: boolean;

  /**
   * List of presets that caused the blocking
   */
  blockingPresets: string[];
}

/**
 * GeoBlock class
 */
export default class GeoBlock {
  /**
   * Create a new GeoBlock instance
   */
  constructor(options?: GeoBlockOptions);

  /**
   * Compile the complete list of blocked countries
   */
  compileBlockList(): string[];

  /**
   * Get country information
   */
  getCountryInfo(): Promise<CountryInfo>;

  /**
   * Check if user should be blocked based on their country
   */
  checkAccess(): Promise<AccessResult>;

  /**
   * Apply visual blocking to the page
   */
  applyVisualBlocking(countryData: CountryInfo | AccessResult): void;

  /**
   * Format the block message with country information
   */
  formatBlockMessage(countryData: CountryInfo | AccessResult): string;

  /**
   * Compute which presets are blocking a specific country code
   */
  computeBlockingPresets(countryCode: string): string[];

  /**
   * Remove visual blocking from the page
   */
  removeVisualBlocking(): void;

  /**
   * Check access and apply blocking if needed
   */
  checkAndBlock(): Promise<boolean>;

  /**
   * Get the list of blocked countries
   */
  getBlockedCountries(): string[];

  /**
   * Get a specific preset's countries
   */
  getPreset(presetName: string): string[] | null;
}
