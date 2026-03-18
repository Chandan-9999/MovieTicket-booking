import stripe from 'stripe'
import Booking from '../models/Booking.js'
import { inngest } from '../inngest/index.js';

export const stripeWebhooks=async(request,response)=>{
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig=request.headers["stripe-signature"]

    let event;

    console.log("--- Webhook Request Received ---");
    // console.log("Headers:", request.headers);

    try {
        event=stripeInstance.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
        console.log("Webhook Signature Verified. Event Type:", event.type);
    } catch (error) {
        console.error("Webhook Signature Verification Failed:", error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    try {
        switch (event.type) {
            case "checkout.session.completed":{
                const session = event.data.object;
                const {bookingId} = session.metadata;

                console.log("Processing checkout.session.completed for bookingId:", bookingId);

                const updatedBooking = await Booking.findByIdAndUpdate(bookingId,{
                    isPaid:true,
                    paymentLink: ""
                }, { new: true })

                if (updatedBooking) {
                    console.log("Booking updated successfully:", updatedBooking._id, "isPaid:", updatedBooking.isPaid);
                } else {
                    console.error("Booking NOT found for ID:", bookingId);
                }

                //Send confirmation email 
                await inngest.send({
                    name:'app/show.booked',
                    data:{bookingId}
                })
                break;
            }
                
            default:
                console.log('Unhandled event type:',event.type);
        }
        response.json({received:true})
    } catch (err) {
        console.error("Webhook processing error:",err);
        response.status(500).send("Internal Server Error")
        
    }
}