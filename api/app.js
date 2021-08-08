import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import initDb from './db/index.js';
import routes from './routes/index.js';

const port = process.env.PORT || 5000;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(helmet());
app.use('/api', limiter);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

(async function () {
  try {
    const db = await initDb();
    routes(app, db).listen(port, () => console.log(`✅ Server live on port ${port}`));
  } catch (error) {
    console.error('❌ Server connection error:', error);
  }
})();
