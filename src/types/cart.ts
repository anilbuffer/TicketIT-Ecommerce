import { EventItem, TicketTier } from './event';

export interface CartItem {
  id: string; // composite key: eventId + ticketTierId
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  venue: string;
  ticketTier: TicketTier;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  serviceFee: number;
  tax: number;
  discount: number;
  total: number;
  totalTickets: number;
}
