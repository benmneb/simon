export default function routes(app, db) {
  app.get('/', (req, res) => {
    res.send('Hello World!!1 🤓');
  });

  app.get('/api', async (req, res) => {
    try {
      const response = await db.collection('highScores').find().limit(5).toArray();
      console.log('response:', response);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting scores:', error.message);
    }
  });

  app.post('/api', async (req, res) => {
    const { name, score } = req.body;

    console.log('req.body:', req.body);

    try {
      const result = await db.collection('highScores').insertOne({ name, score });
      res.status(200).json(result);
    } catch (error) {
      console.error('Error adding score:', error.message);
    }
  });

  return app;
}
