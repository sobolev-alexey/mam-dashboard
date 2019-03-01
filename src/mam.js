import MAM from 'mam.client.js';
import { asciiToTrytes, trytesToAscii } from '@iota/converter'

// Initialise MAM State
let mamState;
const provider = 'https://nodes.devnet.iota.org'

export const initializeMamState = () => {
  mamState = MAM.init(provider);
};

export const fetch = async (root) => {
  const result = await MAM.fetch(root, 'public')
  const messages = result && result.messages && result.messages.map(msg => JSON.parse(trytesToAscii(msg)))
  return messages
};

export const publish = async (packet) => {
  const trytes = asciiToTrytes(JSON.stringify(packet))
  const message = MAM.create(mamState, trytes)
  updateMamState(message.state)
  await MAM.attach(message.payload, message.address, 3, 9)
  return message
};

export const updateMamState = newMamState => (mamState = newMamState);

export const explorer = root =>
  `https://mam-explorer.firebaseapp.com/?mode=public&provider=${provider}&root=${root}`