
export enum UserLevel {
  ERRANTE = 'Errante',
  FARO = 'Faro',
  GUIA = 'Guía'
}

export type UserType = 'collector' | 'creator';

export type Language = 'es' | 'en';

export type ProjectCategory = 'idea' | 'desarrollo_parcial' | 'desarrollo_completo' | 'venta_directa' | 'paquete';

export type EscrowStatus = 'pending_payment' | 'funds_held' | 'item_shipped' | 'item_delivered' | 'verified' | 'released';

export interface CreatorProfile {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  photo: string;
  projects: number;
  insignias: string[];
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  diary: string;
  startingPrice: number;
  currentBid: number;
  reservePrice: number;
  minBidSuggestion: number;
  maxBidSuggestion: number;
  immediatePrice?: number;
  imageUrl: string;
  demoUrl?: string;
  endsAt: string;
  seller: string;
  isMidnightDrop?: boolean;
  status: 'active' | 'finished' | 'immediate' | 'bundled';
  isEarlyAccess?: boolean;
  category: ProjectCategory;
}

export interface TranslationStrings {
  [key: string]: {
    es: string;
    en: string;
  };
}
