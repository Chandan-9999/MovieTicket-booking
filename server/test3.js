import express from 'express';
import { clerkMiddleware } from '@clerk/express';
import 'dotenv/config';
const app = express();
app.use(clerkMiddleware());
app.get('/', (req, res) => {
    let authObj = null;
    let authVal = null;
    try { authVal = req.auth.userId; } catch(e) {}
    try { authObj = req.auth().userId; } catch(e) { authObj = e.message; }
    res.json({
        authVal: authVal === undefined ? 'undefined' : authVal,
        authObj: authObj === undefined ? 'undefined' : authObj,
        authString: Object.keys(req.auth || {}),
        isFunc: typeof req.auth
    });
});
app.listen(3003, () => console.log('ready3'));
