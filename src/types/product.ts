export interface Product {
  id: string;
  version: number;
  versionModifiedAt: string;
  lastMessageSequenceNumber: number;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: PlatformClient;
  createdBy: PlatformClient;
  productType: Reference;
  masterData: MasterData;
  key: string;
  taxCategory: Reference;
  lastVariantId: number;
}

export interface PlatformClient {
  isPlatformClient: boolean;
}

export interface Reference {
  typeId: string;
  id: string;
}

export interface MasterData {
  current: ProductData;
  staged: ProductData;
  published: boolean;
  hasStagedChanges: boolean;
}

export interface ProductData {
  name: LocalizedString;
  description: LocalizedString;
  categories: Reference[];
  categoryOrderHints: Record<string, string>;
  slug: LocalizedString;
  masterVariant: ProductVariant;
  variants: ProductVariant[];
  searchKeywords: Record<string, unknown>;
  attributes: Attribute[];
}

export interface LocalizedString {
  [locale: string]: string;
}

export interface ProductVariant {
  id: number;
  sku: string;
  key: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
  assets: unknown[];
  availability: Availability;
}

export interface DiscountedPrice {
  value: Money;
  discount: { id: string; obj: number };
}

export interface Price {
  id: string;
  value: Money;
  key: string;
  country: string;
  discounted?: DiscountedPrice;
}

export interface Money {
  type: string;
  currencyCode: string;
  centAmount: number;
  fractionDigits: number;
}

export interface Image {
  url: string;
  dimensions: {
    w: number;
    h: number;
  };
  label?: string;
}

export interface Attribute {
  name: string;
  value: LocalizedString | string | number | boolean | Record<string, unknown>;
}

export interface Availability {
  isOnStock: boolean;
  availableQuantity: number;
  version: number;
  id: string;
}
