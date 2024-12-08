import { NativeEventEmitter, NativeModules } from 'react-native';

const { RazorpayCheckout } = NativeModules;
const razorpayEmitter = new NativeEventEmitter(RazorpayCheckout);

export interface PaymentSuccessResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface PaymentErrorResponse {
    code: number;
    description: string;
}

interface RazorpayCheckoutProps {
    key: string;
    amount: number;
    name: string;
    description: string;
    prefill?: {
        email?: string;
        contact?: string;
    };
    image?: string;
    currency?: string;
    theme?: {
        color: string;
    };
    order_id?: string;
}

export class Razorpay {
    static open(options: RazorpayCheckoutProps): Promise<PaymentSuccessResponse | PaymentErrorResponse> {
        return new Promise((resolve, reject) => {
            const subscription = razorpayEmitter.addListener('PAYMENT_SUCCESS', (data: PaymentSuccessResponse) => {
                resolve(data);
                subscription.remove();
            });

            razorpayEmitter.addListener('PAYMENT_ERROR', (data: PaymentErrorResponse) => {
                reject(data);
                subscription.remove();
            });

            RazorpayCheckout.open(options);
        });
    }
}
