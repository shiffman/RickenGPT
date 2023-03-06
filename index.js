import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';

const app = express();

import fs from 'fs';

const instructions = fs.readFileSync('instructions.txt', 'utf-8');
const instructions_short = fs.readFileSync('instructions_short.txt', 'utf-8');

// make all the files in 'public' available
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.post('/openai', async (request, response) => {
  const data = request.body;
  console.log(`Receiving request: ${JSON.stringify(data)}`);
  const results = await queryOpenAI(data);
  results.status = 'success';
  response.json(results);
});

dotenv.config();

async function queryOpenAI(data) {
  const { prompt, temperature, num, messages } = data;
  // console.log(data);
  messages.unshift({ role: 'system', content: instructions });
  messages.push({ role: 'user', content: prompt });
  messages.push({ role: 'system', content: instructions_short });
  console.log(messages);
  const openai_api = 'https://api.openai.com/v1/chat/completions';
  const response = await fetch(openai_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_SECRET_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      temperature: temperature,
      n: num,
      messages: messages,
    }),
  });

  const completion = await response.json();
  return completion.choices;
}
