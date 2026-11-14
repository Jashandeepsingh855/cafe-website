export interface SiteConfig {
  name: string;
  tagline: string;
  subTagline: string;
  pureVegNotice: string;
  altitudeNote: string;
  address: {
    line1: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    full: string;
    mapUrl: string;
    mapEmbedUrl: string;
  };
  hours: {
    openTime: string;
    closingTime: string;
    days: string;
    isOpenNow: boolean;
  };
  contact: {
    phone: string;
    phoneRaw: string;
    whatsapp: string;
    whatsappRaw: string;
    email: string;
  };
  links: {
    zomato: string;
    swiggy: string;
    googleReview: string;
    instagram: string;
    youtube: string;
    maps: string;
  };
  tickerText: string;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  name: 'Daily Coffee Drip',
  tagline: 'Artisanal Roastery & Craft Kitchen',
  subTagline: '100% Pure Vegetarian Roastery & Kitchen',
  pureVegNotice: '100% Pure Veg • Jain Adaptations Available',
  altitudeNote: 'Single Origin Chikmagalur Shade-Grown Beans • 1,350m Altitude',
  address: {
    line1: '12th Main Road, HAL 2nd Stage',
    area: 'Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    full: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    mapUrl: 'https://maps.google.com/?q=Daily+Coffee+Drip+Indiranagar+Bengaluru',
    mapEmbedUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHrrkPpb7HXk72gUCrU29swJogLVWZgJZksdkJRvgXNQTpv56FwtUDHf0bP4Zw4t4mBZmPafc2oxVNbw9ZghuYPiLAZquSTY_xEKMJGgwtEZjbycbg3IP-xJ1r4T86HYJ-deSaZO0bGXo29Kw4YiQzqg6jqkfjX0LUklC4fs0M1s_OpeONSVA9MZcvV0A_Q-v_SgI0nUHEQlbMmbyPhRL1XuPuKiL1xPCokCbRufU',
  },
  hours: {
    openTime: '07:00 AM',
    closingTime: '11:00 PM',
    days: 'Seven Days a Week (Mon – Sun)',
    isOpenNow: true,
  },
  contact: {
    phone: '(408) 555-0120',
    phoneRaw: '+914085550120',
    whatsapp: '+91 408 555 0120',
    whatsappRaw: '914085550120',
    email: 'concierge@dailycoffeedrip.com',
  },
  links: {
    zomato: 'https://www.zomato.com/bangalore',
    swiggy: 'https://www.swiggy.com/restaurants',
    googleReview: 'https://g.page/r/daily-coffee-drip/review',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    maps: 'https://maps.google.com/?q=Daily+Coffee+Drip+Indiranagar',
  },
  tickerText: 'Single Origin Chikmagalur Shade-Grown Beans • 100% Pure Vegetarian Kitchen • Jain Customisable • 142 Handcrafted Items',
};

/**
 * Generates an instant 1-tap WhatsApp direct order URL.
 */
export function getWhatsAppOrderUrl(dishName: string, price: number, whatsappNumber = DEFAULT_SITE_CONFIG.contact.whatsappRaw): string {
  const text = encodeURIComponent(
    `Hello Daily Coffee Drip! I would like to order: *${dishName}* (₹${price}) from your Indiranagar Roastery.`
  );
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

/**
 * Generates an instant 1-tap WhatsApp location request URL.
 */
export function getWhatsAppLocationUrl(whatsappNumber = DEFAULT_SITE_CONFIG.contact.whatsappRaw): string {
  const text = encodeURIComponent(
    `Hello Daily Coffee Drip! Please send me the live Google Maps location & parking directions to your Indiranagar Roastery.`
  );
  return `https://wa.me/${whatsappNumber}?text=${text}`;
}

/**
 * Generates a pre-filled reservation confirmation message for the café owner to send to guests.
 */
export function getWhatsAppBookingConfirmationUrl(
  guestPhone: string,
  guestName: string,
  partySize: string,
  date: string,
  timeSlot: string,
  zone: string
): string {
  const cleanPhone = guestPhone.replace(/[^0-9]/g, '');
  const text = encodeURIComponent(
    `Hello ${guestName}! ✨\n\nYour table reservation at *Daily Coffee Drip* is *CONFIRMED*!\n\n` +
    `📅 Date: ${date}\n` +
    `⏰ Time: ${timeSlot}\n` +
    `👥 Guests: ${partySize}\n` +
    `🌿 Zone: ${zone}\n` +
    `📍 Location: 12th Main, HAL 2nd Stage, Indiranagar\n\n` +
    `We hold your table for 15 minutes past reservation time. See you soon for an unhurried specialty coffee experience!`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

/**
 * Client-side helper to load site config with localStorage persistence.
 */
export function getClientSiteConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONFIG;
  try {
    const saved = localStorage.getItem('dcd_site_config');
    if (saved) {
      return { ...DEFAULT_SITE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (err) {
    console.error('Failed to parse saved site config:', err);
  }
  return DEFAULT_SITE_CONFIG;
}

/**
 * Client-side helper to save site config to localStorage.
 */
export function saveClientSiteConfig(config: SiteConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dcd_site_config', JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save site config:', err);
  }
}

export interface ReservationRecord {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  partySize: string;
  zone: string;
  date: string;
  timeSlot: string;
  dietaryOptions: {
    pureVeg: boolean;
    strictJain: boolean;
    nutFree: boolean;
    celebration: boolean;
  };
  status: 'Pending' | 'Confirmed' | 'Seated' | 'Cancelled';
  createdAt: string;
  specialRequests?: string;
}

export const SAMPLE_RESERVATIONS: ReservationRecord[] = [
  {
    id: 'RES-892101',
    name: 'Ananya Sharma',
    whatsapp: '+91 98450 12345',
    email: 'ananya.s@example.com',
    partySize: '2 Guests',
    zone: 'Hearth & Banquette Salon',
    date: '2026-11-14',
    timeSlot: 'Golden Hour (05:00 PM)',
    dietaryOptions: {
      pureVeg: true,
      strictJain: false,
      nutFree: false,
      celebration: true,
    },
    status: 'Confirmed',
    createdAt: '2026-11-14T10:15:00.000Z',
    specialRequests: 'Window seat preference for anniversary celebration',
  },
  {
    id: 'RES-892102',
    name: 'Rohan Mehta',
    whatsapp: '+91 99001 88776',
    email: 'rohan.mehta@example.com',
    partySize: '4 Guests',
    zone: 'Al Fresco Veranda',
    date: '2026-11-14',
    timeSlot: 'Evening Hearth (08:00 PM)',
    dietaryOptions: {
      pureVeg: true,
      strictJain: true,
      nutFree: true,
      celebration: false,
    },
    status: 'Pending',
    createdAt: '2026-11-14T11:30:00.000Z',
    specialRequests: 'Strict Jain preparation for all dishes please',
  },
  {
    id: 'RES-892103',
    name: 'Vikramaditya Rao',
    whatsapp: '+91 98860 45450',
    email: 'vikram.rao@example.com',
    partySize: '1 Guest',
    zone: 'Backlit Arch Bar',
    date: '2026-11-15',
    timeSlot: 'Morning Roast (08:30 AM)',
    dietaryOptions: {
      pureVeg: true,
      strictJain: false,
      nutFree: false,
      celebration: false,
    },
    status: 'Seated',
    createdAt: '2026-11-14T08:00:00.000Z',
    specialRequests: 'Interested in Chikmagalur single origin pour-over flight',
  },
];

export function getClientReservations(): ReservationRecord[] {
  if (typeof window === 'undefined') return SAMPLE_RESERVATIONS;
  try {
    const saved = localStorage.getItem('dcd_reservations');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to parse reservations from localStorage:', err);
  }
  return SAMPLE_RESERVATIONS;
}

export function saveClientReservations(reservations: ReservationRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('dcd_reservations', JSON.stringify(reservations));
  } catch (err) {
    console.error('Failed to save reservations:', err);
  }
}
