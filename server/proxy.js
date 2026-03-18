import express from 'express';
import crypto from 'crypto';


const app = express();
const targetSecret = process.env.STRIPE_WEBHOOK_SECRET;

app.post('/api/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    // 1. decode json
    const payloadStr = req.body.toString('utf8');

    // 2. replace
    let modifiedPayloadStr = payloadStr;
    if (payloadStr.includes('"payment_intent.succeeded"')) {
        modifiedPayloadStr = payloadStr.replace('"payment_intent.succeeded"', '"payment_intent.completed"');
        console.log("Rewrote event to payment_intent.completed");
    }

    // 3. sign
    const timestamp = Math.floor(Date.now() / 1000);
    const signedPayload = `${timestamp}.${modifiedPayloadStr}`;
    const signature = crypto.createHmac('sha256', targetSecret).update(signedPayload).digest('hex');
    const stripeSignature = `t=${timestamp},v1=${signature}`;

    // 4. forward
    try {
        const response = await fetch('http://localhost:3000/api/stripe', {
            method: 'POST',
            body: modifiedPayloadStr,
            headers: {
                'Content-Type': 'application/json',
                'stripe-signature': stripeSignature
            }
        });
        const responseText = await response.text();
        console.log(`Forwarded. Backend responded with ${response.status}: ${responseText}`);
        res.status(response.status).send(responseText);
    } catch (e) {
        console.error("Proxy error forwarding to localhost:3000", e);
        res.status(500).send('Proxy Error');
    }
});

app.listen(3001, () => {
    console.log('Stripe Event Rewriter Proxy listening on port 3001');
    console.log(`Using webhook secret: ${targetSecret.substring(0, 10)}...`);
});
