const express = require('express');
const { BigQuery } = require('@google-cloud/bigquery');

const app = express();
const bigquery = new BigQuery();

app.use(express.json());

app.post('/', async (req, res) => {

  try {

    const pubSubMessage = req.body.message;

    const data = JSON.parse(
      Buffer
        .from(pubSubMessage.data, 'base64')
        .toString()
    );

    console.log("Received:", data);

    const row = {
      candidateId: data.candidateId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      source: data.source,
      skills: data.skills,
      loadTimestamp: new Date()
    };

    await bigquery
      .dataset('staffing')
      .table('candidate')
      .insert([row]);

    console.log('Inserted to BigQuery');

    return res.status(200).send('Success');

  } catch (err) {

    console.error(err);

    return res.status(500).send(err);
  }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});