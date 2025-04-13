import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import getRazorpayInstance from '@/lib/razorpay';
import dbConnect from '@/lib/mongodb';
import Order, { IOrderItem } from '@/models/Order';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { items, userId } = body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ message: 'Invalid cart items' }, { status: 400 });
        }

        // Calculate order amount
        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        // Round to 2 decimal places and convert to paise (Razorpay uses smallest currency unit)
        const amountInPaise = Math.round(totalAmount * 100);

        // Create a unique order ID
        const orderId = uuidv4();

        // Initialize Razorpay instance
        const razorpay = getRazorpayInstance();

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: orderId,
        });

        // Connect to MongoDB
        await dbConnect();

        // Save order in pending state
        const orderDoc = {
            orderId,
            userId: userId || 'guest',
            items: items as IOrderItem[],
            totalAmount,
            status: 'pending' as const
        };

        // Create a new order document
        const newOrder = new Order(orderDoc);
        await newOrder.save();

        // Return the order details to the client
        return NextResponse.json({
            id: razorpayOrder.id,
            currency: razorpayOrder.currency,
            amount: amountInPaise,
            orderId,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({
            message: 'Error creating order',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}