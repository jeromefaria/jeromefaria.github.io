// Schema.org types for structured data

export interface SchemaOrganization {
  '@type': 'Organization';
  name: string;
}

export interface SchemaPerson {
  '@type': 'Person';
  name: string;
}

export interface SchemaPostalAddress {
  '@type': 'PostalAddress';
  addressLocality: string;
  addressCountry: string;
}

export interface SchemaPlace {
  '@type': 'Place';
  name: string;
  address: SchemaPostalAddress;
}

export interface SchemaMusicEvent {
  '@type': 'MusicEvent';
  name: string;
  startDate: string;
  location: SchemaPlace;
  performer: SchemaPerson;
}

export interface SchemaItemListElement {
  '@type': 'ListItem';
  position: number;
  item: SchemaMusicEvent;
}

export interface SchemaItemList {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  name: string;
  description: string;
  numberOfItems: number;
  itemListElement: SchemaItemListElement[];
}

export interface SchemaMusicAlbum {
  '@type': 'MusicAlbum';
  name: string;
  url: string;
  image?: string;
  datePublished: string;
  numTracks?: number;
  byArtist: SchemaPerson;
}

export interface SchemaBook {
  '@type': 'Book';
  name: string;
  image: string;
  url: string;
  datePublished: string;
  isbn: string;
  publisher: SchemaOrganization;
  editor: SchemaPerson[];
  contributor: SchemaPerson;
}
