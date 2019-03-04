import MAM from 'mam.client.js';
import { asciiToTrytes, trytesToAscii } from '@iota/converter'

// Initialise MAM State
let mamState;
const provider = 'https://nodes.devnet.iota.org'

export const initializeMamState = () => {
  mamState = MAM.init(provider);
};

export const fetch = async (initialRoot) => {
  try {
    const messages = []
    let root = initialRoot
    let fetchResult
    do {
      fetchResult = await MAM.fetchSingle(root, 'public')
      const message = fetchResult && fetchResult.payload && JSON.parse(trytesToAscii(fetchResult.payload))
      if (message) {
        message.address = root
        messages.push(message)
      }
      root = fetchResult.nextRoot
    } while (!!fetchResult.payload)
    return messages
  } catch (e) {
    console.error(e)
  }
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