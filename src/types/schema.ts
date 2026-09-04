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
  inLanguage?: string;
  startDate: string;
  endDate?: string;
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
  inLanguage?: string;
  url: string;
  sameAs?: string[];
  image?: string;
  datePublished: string;
  numTracks?: number;
  byArtist: SchemaPerson;
}

export interface SchemaBook {
  '@type': 'Book';
  name: string;
  inLanguage: string;
  image: string;
  url: string;
  datePublished: string;
  isbn: string;
  publisher: SchemaOrganization;
  editor: SchemaPerson[];
  contributor: SchemaPerson;
}

export interface SchemaCreativeWork {
  '@context': 'https://schema.org';
  '@type': 'CreativeWork';
  name: string;
  description?: string;
  url: string;
  mainEntityOfPage: string;
  dateCreated: string;
  image?: string;
  creator: SchemaPerson;
}

export type SchemaRelease =
  | (SchemaMusicAlbum & { '@context': 'https://schema.org'; mainEntityOfPage: string })
  | (SchemaBook & { '@context': 'https://schema.org'; mainEntityOfPage: string })
  | SchemaCreativeWork;

export interface SchemaProfilePerson {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  url: string;
  jobTitle: string;
  description: string;
  image: string;
  sameAs: string[];
}

export interface SchemaContactPage {
  '@context': 'https://schema.org';
  '@type': 'ContactPage';
  inLanguage: string;
  mainEntity: {
    '@type': 'Person';
    name: string;
    email: string;
    url: string;
  };
}

export interface SchemaMusicGroup {
  '@type': 'MusicGroup';
  name: string;
  url: string;
  genre: string[];
  album: SchemaMusicAlbum[];
}

export interface SchemaWorksGraph {
  '@context': 'https://schema.org';
  '@graph': [SchemaMusicGroup, SchemaBook];
}
