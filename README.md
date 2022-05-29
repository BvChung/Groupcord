# [Groupcord](https://groupcord.herokuapp.com/)

## Overview

Groupcord is an group chat application that uses the [MERN](https://www.mongodb.com/mern-stack) stack. Real time chat messaging and group creation is implemented using [Socket.IO](https://socket.io/).

## Table of Contents

- [Tech](#tech)<br/>
- [Development](#development)<br/>
- [Demos](#demo-gifs)<br/>

## Tech

### Front-End

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [TailwindCSS](https://tailwindcss.com/)

### Back-End

- [Node.JS](https://nodejs.org/en/)
- [Express.JS](https://expressjs.com/)
- [Mongoose.JS](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/)

### Database

- [MongoDB](https://www.mongodb.com/)

### Authentication

- [JSON Web Tokens](https://jwt.io/)

## Development

### Running backend

1. Install dependencies

```
npm i
```

2. Set up `.env` **(.env will be in .gitignore)**

```bash
# [development] for development
# Change to [production] for deployment to connect to react frontend
NODE_ENV = development

# Port number can be changed to any value
PORT = 3001

# Connect your mongoDB cluster using the url from your mongo account
MONGO_URI = mongoDB_cluster_connection

JWT_ACCESS_SECRET = base64_encoded_string

JWT_REFRESH_SECRET = base64_encoded_string
```

Base 64 encoded strings can be generated using the crypto module from nodejs.

```bash
# Quotes generated do not need to be inputted into the env
require('crypto').randomBytes(64).toString('hex')
```

3. Starting backend server with nodemon

```
npm run server
```

### Running frontend

1. Install dependencies

```
cd frontend

npm i
```

2. Set up `.env` **(.env will be in .gitignore)**

```bash
# Access to the image folder in the backend used for avatars and icons.
REACT_APP_PUBLIC_FOLDER = http://localhost:3001/images/

# Base url for axios api
REACT_APP_CHAT_API = http://localhost:3001

# Create demo guest account information in mongoDB (these values can be changed)
REACT_APP_GUEST_EMAIL = guestaccount@gmail.com

REACT_APP_GUEST_PASSWORD = guestaccount
```

3. In frontend in **api/axios.js** uncomment the BASE_URL to make a connection with axios and your backend.

```bash
const BASE_URL = process.env.REACT_APP_CHAT_API;

# In public and private axios
baseURL: BASE_URL,
```

4. Starting frontend

```
npm run start
```

### Running both frontend and backend at the same time

Both frontend and backend can be run at the same time in the same terminal using concurrently, view the [package.json](https://github.com/BvChung/groupcord/blob/main/package.json) in the [root](https://github.com/BvChung/groupcord).

```
npm run dev
```
