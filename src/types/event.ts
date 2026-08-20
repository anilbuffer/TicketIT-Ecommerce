export type EventCategory = 
  | 'All' 
  | 'Concerts' 
  | 'Music Festivals' 
  | 'Tech Conferences' 
  | 'Theatre & Arts' 
  | 'Sports' 
  | 'Comedy & Shows';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  perks: string[];
  availableCount: number;
  isPopular?: boolean;
  soldOut?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  category: EventCategory;
  date: string;
  displayDate: string;
  time: string;
  location: {
    venue: string;
    city: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  image: string;
  bannerImage?: string;
  priceStartingFrom: number;
  rating: number;
  reviewCount: number;
  organizer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  description: string;
  highlights: string[];
  tags: string[];
  isTrending?: boolean;
  isSellingFast?: boolean;
  ticketTiers: TicketTier[];
}
