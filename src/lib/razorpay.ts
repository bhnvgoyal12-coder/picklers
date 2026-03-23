export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CheckoutOptions {
  orderId: string;
  amount: number;
  currency: string;
  gameName: string;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: (error: unknown) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function openRazorpayCheckout(options: CheckoutOptions) {
  const rzp = new (window as any).Razorpay({
    key: (import.meta.env.VITE_RAZORPAY_MODE || 'test') === 'live'
      ? import.meta.env.VITE_RAZORPAY_LIVE_KEY_ID
      : import.meta.env.VITE_RAZORPAY_TEST_KEY_ID,
    amount: options.amount,
    currency: options.currency,
    name: 'Picklers',
    description: `Game: ${options.gameName}`,
    order_id: options.orderId,
    prefill: {
      name: options.playerName,
      email: options.playerEmail,
      contact: options.playerPhone,
    },
    handler: options.onSuccess,
    modal: {
      ondismiss: () => options.onFailure('dismissed'),
    },
  });
  rzp.open();
}
