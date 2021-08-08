import mongodb from 'mongodb';

import app from './app.js';
import routes from './routes.js';

const port = process.env.PORT || 5000;
const uri = 'mongodb://127.0.0.1:27017/simon';
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () =>
  console.log(`✅ Server running on port ${port}... connecting to MongoDB...`)
);

(async function () {
  try {
    await client.connect();
    const db = client.db('simon');
    await db.command({ ping: 1 });
    console.log('✅ MongoDB connected');
    routes.forEach((route) => {
      route(app, db);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
})();
