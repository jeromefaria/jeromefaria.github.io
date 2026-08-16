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
