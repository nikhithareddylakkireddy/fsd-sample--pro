export interface Hotel {
  id: string;
  name: string;
  description: string;
  city: string;
  state: string;
  price: number;
  rating: number;
  image: string;
  amenities: string[];
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  costForTwo: number;
  image: string;
}

export interface Booking {
  id: string;
  userId: string;
  userEmail: string;
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  totalPrice: number;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}
