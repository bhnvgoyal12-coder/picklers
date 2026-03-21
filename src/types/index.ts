export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  end_time: string;
  location_name: string;
  location_address: string;
  location_map_url: string;
  court_info: string;
  max_players: number;
  price_per_player: number; // in paise
  currency: string;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  created_by: string | null;
  created_at: string;
  updated_at: string;
  spots_taken?: number;
  registrations?: Registration[];
  creator?: Profile;
}

export interface Registration {
  id: string;
  game_id: string;
  user_id: string | null;
  player_name: string;
  player_phone: string;
  player_email: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_amount: number;
  registered_at: string;
  game?: Game;
  profile?: Profile;
}

export interface RazorpayOrderResponse {
  order_id: string;
  amount: number;
  currency: string;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
