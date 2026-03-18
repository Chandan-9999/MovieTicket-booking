import express from 'express';
import { clerkMiddleware } from '@clerk/express';
const app = express();
app.use(clerkMiddleware());
app.get('/', (req, res) => {
    res.json({
        authType: typeof req.auth,
        keys: Object.keys(req.auth || {})
    });
});
app.listen(3001, () => console.log('started'));
