let history = [];

// messages = [
//   { role: 'system', content: 'You are a helpful assistant.' },
//   { role: 'user', content: 'Who won the world series in 2020?' },
//   { role: 'assistant', content: 'The Los Angeles Dodgers won the World Series in 2020.' },
//   { role: 'user', content: 'Where was it played?' },
// ];

const messages = [];

function next() {
  let conversation = {
    prompt: createInput(),
    submit: createButton('submit'),
  };
  conversation.prompt.size(500);
  // conversation.submit.mousePressed(submitGPT);
  conversation.prompt.changed(submitGPT);
  return conversation;
}

function setup() {
  noCanvas();
  let start = next();
  current = start;
}

async function submitGPT() {
  const prompt = current.prompt.value();
  const inputs = {
    prompt: prompt,
    temperature: 1.2,
    num: 1,
    messages: messages,
  };
  console.log(inputs);
  const data = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputs),
  };
  const response = await fetch('openai', data);
  const outputs = await response.json();
  // console.log(outputs);
  // createP('Temperature: ' + inputs.temperature);
  // for (let i = 0; i < outputs.length; i++) {
  const reply = outputs[0].message.content.replaceAll('\n', '<br/>');
  createP(reply);

  messages.push({ role: 'user', content: prompt });
  messages.push({ role: 'assistant', content: reply });
  current = next();
}
