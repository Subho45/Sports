import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt = 'receipt#1' } = body;

    // For a real integration, this will create an order in Razorpay.
    // If we are just mocking without real keys, this might throw an error from Razorpay
    if (process.env.RAZORPAY_KEY_ID) {
      const options = {
        amount: amount * 100, // amount in smallest currency unit
        currency,
        receipt,
      };
      const order = await razorpay.orders.create(options);
      return NextResponse.json({ success: true, order }, { status: 200 });
    } else {
      // Mocked order response for local testing without keys
      return NextResponse.json({
        success: true,
        order: {
          id: `order_mock_${Date.now()}`,
          amount: amount * 100,
          currency: currency
        }
      }, { status: 200 });
    }

  } catch (error: any) {
    console.error('Razorpay Order Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
