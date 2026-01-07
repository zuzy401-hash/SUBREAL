
import { AuctionItem, TranslationStrings, CreatorProfile, ProjectCategory } from './types';

export const APP_URL = "https://subreal.revelation.app";

// Commission & Subscription Structure
export const COMMISSIONS = {
  CREATOR_SALE: 0.05, 
  AUCTIONEER_PROGRAM: {
    monthly: 29,
    trialDays: 15
  },
  COLLECTOR_MEMBERSHIP: {
    ERRANTE: 0,
    FARO: 15,
    GUIA: 45
  }
};

export const ACCEPTED_PAYMENTS = [
  { name: 'Ethereum', symbol: 'ETH', icon: '💎' },
  { name: 'Solana', symbol: '☀️', icon: '☀️' },
  { name: 'USDC', symbol: 'USDC', icon: '💵' },
  { name: 'Stripe', symbol: 'USD', icon: '💳' }
];

export const PRICING_TABLE: Record<ProjectCategory, { min: number, max: number, label: { es: string, en: string }, icon: string }> = {
  idea: { min: 50, max: 200, label: { es: 'Idea Pura', en: 'Pure Idea' }, icon: '💡' },
  desarrollo_parcial: { min: 200, max: 1500, label: { es: 'Desarrollo Parcial', en: 'Partial Dev' }, icon: '🧱' },
  desarrollo_completo: { min: 1500, max: 10000, label: { es: 'Desarrollo Completo', en: 'Full Dev' }, icon: '🏗️' },
  venta_directa: { min: 100, max: 5000, label: { es: 'Venta Directa', en: 'Direct Sale' }, icon: '🏷️' },
  paquete: { min: 500, max: 8000, label: { es: 'Paquete de Tesoros', en: 'Treasure Bundle' }, icon: '📦' }
};

export const MANIFESTO_TEXT = 'En el umbral entre lo tangible y lo místico, SUBREAL emerge como el santuario de los objetos con alma y las ideas de los arquitectos del mañana. Aquí, la oscuridad no es el final, sino el refugio donde los tesoros aguardan su revelación.';

export const I18N: TranslationStrings = {
  nav_home: { es: 'Inicio', en: 'Home' },
  nav_auctions: { es: 'Subastas', en: 'Auctions' },
  nav_creators: { es: 'Arquitectos', en: 'Creators' },
  nav_messages: { es: 'Mensajes', en: 'Messages' },
  nav_sell: { es: 'Vender', en: 'Sell' },
  nav_profile: { es: 'Perfil', en: 'Profile' },
  nav_categories: { es: 'Categorías', en: 'Categories' },
  escrow_title: { es: 'Sistema Escrow Seguro', en: 'Secure Escrow System' },
  escrow_desc: { es: 'Protegemos tu capital. El pago se retiene en el vacío místico hasta que verificas la entrega.', en: 'We protect your capital. Payment is held in the mystical void until you verify delivery.' },
  trial_offer: { es: '¡Oferta de Prelanzamiento! 15 días gratis.', en: 'Pre-launch Offer! 15 days free.' },
  subscription_btn: { es: 'Suscribirse al Programa', en: 'Subscribe to Program' },
  hero_title: { es: 'SUBREAL', en: 'SUBREAL' },
  hero_subtitle: { es: 'Arquitectura del Vacío y Objetos con Alma', en: 'Architecture of the Void and Objects with Soul' }
};

export const MOCK_CREATORS: CreatorProfile[] = [
  {
    id: 'c1',
    name: 'Juan Pérez',
    specialty: 'Desarrollo de Interfaz & UX Mística',
    bio: 'Me especializo en el desarrollo de la interfaz e ideas para el desarrollo de aplicaciones. Mi enfoque es la elegancia funcional.',
    photo: 'https://i.pravatar.cc/150?u=juan',
    projects: 14,
    insignias: ['Sello de Oro', 'Arquitecto Visionario']
  },
  {
    id: 'c2',
    name: 'Elena Sombras',
    specialty: 'Arquitecta de Backend & AI',
    bio: 'Construyo los cimientos invisibles que protegen cada transacción en el vacío y entreno guías artificiales.',
    photo: 'https://i.pravatar.cc/150?u=elena',
    projects: 22,
    insignias: ['Escudo del Vacío']
  }
];

export const MOCK_AUCTIONS: AuctionItem[] = [
  {
    id: '1',
    title: 'El Reloj del Ser Errante',
    description: 'Un cronómetro de bronce que parece detener el tiempo.',
    diary: 'Este reloj perteneció a un viajero que nunca usó mapas.',
    startingPrice: 300,
    currentBid: 450,
    reservePrice: 600,
    minBidSuggestion: 475,
    maxBidSuggestion: 800,
    imageUrl: 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80',
    demoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    seller: 'LuzDorada_99',
    status: 'active',
    isEarlyAccess: true,
    category: 'desarrollo_completo'
  },
  {
    id: '2',
    title: 'Fragmentos de UI Celeste',
    description: 'Componentes React con estética etérea y animaciones fluidas.',
    diary: 'Nacido de una noche de insomnio frente al mar de código.',
    startingPrice: 150,
    currentBid: 210,
    reservePrice: 200,
    minBidSuggestion: 225,
    maxBidSuggestion: 500,
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80',
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
    seller: 'Juan Pérez',
    status: 'active',
    category: 'desarrollo_parcial'
  }
];
