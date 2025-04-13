import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
            cartItems // Accept cart items if sent from client
        } = body;

        // Verify the payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generatedSignature !== razorpay_signature) {
            return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
        }

        // Connect to MongoDB
        await dbConnect();

        // Update the order status in database
        const filter = { orderId };
        const update = {
            status: 'completed',
            paymentId: razorpay_payment_id,
            // If additional cart details are provided in the request, update them
            ...(cartItems && { items: cartItems })
        };

        const updatedOrder = await Order.findOneAndUpdate(
            filter,
            update,
            { new: true }
        ).exec();

        if (!updatedOrder) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // Log successful payment and data storage
        console.log('Payment successful, order data stored:', updatedOrder);

        return NextResponse.json({
            message: 'Payment verified successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Error verifying payment:', error);
        return NextResponse.json({
            message: 'Error verifying payment',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}