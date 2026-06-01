import { apiClient } from "./client";

export type PaymentIntentResponse = {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
};

export function createPaymentIntent(bookingId: string) {
  return apiClient<PaymentIntentResponse>("/v1/payments/intent", {
    method: "POST",
    body: { bookingId },
  });
}
