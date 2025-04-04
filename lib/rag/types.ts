import { ObjectId } from 'mongodb';

export interface SearchResult {
  content: string;
  url: string;
  title: string;
}

export interface ProcessedContent {
  url: string;
  title: string;
  content: string;
}

export interface CompanyDocument {
  _id: ObjectId;
  companyName: string;
  searchResults: any;
  processedContent: ProcessedContent[];
  createdAt: Date;
}

export interface ChunkWithMetadata {
  text: string;
  metadata: {
    companyId: string;
    url: string;
    title: string;
  };
}

export interface VectorDocument extends ChunkWithMetadata {
  embedding: number[];
}

export interface QueryResult {
  context: string;
  companyId: string;
  sources: {
    title: string;
    url: string;
  }[];
}