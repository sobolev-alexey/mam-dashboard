# Audit Trail - Control Dashboard Demo

This demo allows for a user to adjust form inputs and then attach the data to the tangle using Masked Authenticated Messaging.

![Screenshot of Demo](https://i.imgur.com/Hpq3q0i.png)

### Technology

The demo uses the following:

- [Mam.client.js](https://github.com/iotaledger/mam.client.js) - Generating MAM messages
- [Iota.js](https://github.com/iotaledger/iota.js) - Interacting with IOTA network nodes
- [React.js](https://github.com/facebook/react) - Frontend & Interaction
- [Chartist.js](https://gionkunz.github.io/chartist-js/) - Charting library


## Getting started

Before you can run this application, you will need to install `Node.js` on your machine. Once you've installed `Node.js`, you can use `npm` to run commands listed below.

### To run for Development.

```javascript
yarn

yarn start
```

The application is running on http://localhost:3000


### To run for Production:

#### 1. Install Firebase CLI

Install the Firebase CLI by running the following command:

```javascript
npm install -g firebase-tools
```

#### 2. Install packages

```javascript
yarn
```

#### 3. Log in fo Firebase

Log in to Firebase (for the first time use). Follow instructions on the screen.

```javascript
firebase login
```

#### 4. Build and deploy

```javascript
yarn build
firebase deploy
```
