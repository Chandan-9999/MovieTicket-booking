import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import 'dotenv/config';
const app = express();
app.use(clerkMiddleware());
app.get('/', (req, res) => {
    res.json({
        typeofAuth: typeof req.auth,
        hasUserId: req.auth && typeof req.auth.userId,
        isAuthFunction: typeof req.auth === 'function'
    });
});
app.listen(3002, () => console.log('ready'));
