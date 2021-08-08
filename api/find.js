import mongodb from 'mongodb';

async function find() {
  const uri = 'mongodb://127.0.0.1:27017/simon';
  const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();

    await findHighScores(client);
  } catch (error) {
    console.error(err.message);
  } finally {
    await client.close();
  }
}

/**
 * @param {MongoClient} client
 */
async function findHighScores(client) {
  try {
    const result = await client.db.collection('highScores').find().limit(5).toArray();
    console.log('result:', result);
  } catch (error) {
    console.error('Error getting scores:', error.message);
  }
}
