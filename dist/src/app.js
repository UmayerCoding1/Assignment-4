import express from 'express';
import { config } from './config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
app.use(cors({
    origin: config.app_url,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get('/', (req, res) => {
    res.send('FixItNow Server Running');
});
export default app;
//# sourceMappingURL=app.js.map