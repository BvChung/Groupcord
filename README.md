# [Groupcord](https://groupcord.herokuapp.com/)
###  *Previously hosted on heroku, free deployment access is no longer available as of August 25, 2022 (https://blog.heroku.com/next-chapter)

## Overview

Groupcord is a group chat application that uses the [MERN](https://www.mongodb.com/mern-stack) stack. Real time chat messaging, group creation/editing and account editing is implemented using [Socket.IO](https://socket.io/). User avatars and group icons are uploaded and retrieved using [Cloudinary](https://cloudinary.com/).

## Table of Contents

- [Tech](#tech)<br/>
- [Development](#development)<br/>
- [Authentication](#authentication)<br/>
- [Demos](#demo-gifs)<br/>

## Tech

### Front-End

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TailwindCSS](https://tailwindcss.com/)

### Back-End

- [Node.JS](https://nodejs.org/en/)
- [Express.JS](https://expressjs.com/)
- [Mongoose.JS](https://mongoosejs.com/)
- [Socket.IO](https://socket.io/)
- [JSON Web Tokens](https://jwt.io/)

### Database

- [MongoDB](https://www.mongodb.com/)

### Content delivery network (CDN)

- [Cloudinary](https://cloudinary.com/)

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

# Any value can be provided in order to generate JWTs
JWT_ACCESS_SECRET = value1

JWT_REFRESH_SECRET = value2

# Connect your Cloudinary account configs
CLOUDINARY_CLOUD_NAME = your_cloud_name

CLOUDINARY_API_KEY = your_cloud_key

CLOUDINARY_API_SECRET = your_cloud_secret

# Connection to the respective upload folders for image upload/deletion
CLOUDINARY_AVATAR_UPLOAD = folder1

CLOUDINARY_ICON_UPLOAD = folder2
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
# PORT is your respective port value from the backend

# Url for Axios and Socket.IO connection to backend
REACT_APP_CHAT_API = http://localhost:PORT

# Create demo guest account information in mongoDB (these values can be changed)
REACT_APP_GUEST_EMAIL = guestaccount@gmail.com

REACT_APP_GUEST_PASSWORD = guestaccount
```

3. In frontend in [api/axios.js](https://github.com/BvChung/groupcord/blob/main/frontend/src/api/axios.js) uncomment the BASE_URL to make a connection with axios and your backend.

```bash
const BASE_URL = process.env.REACT_APP_CHAT_API

# In public and private axios
baseURL: BASE_URL
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

## Authentication

### Axios interceptors

- User login, registering, logout and issuing new access JWTs do not have interceptors.
- All http methods involving messages, groups, group members, and changing account information will be subjected to interceptors.

### User Login/Register

**Response from backend**

1. A HTTP only cookie containing a refresh JWT **(1 day expiration)** is granted and JWT value is stored in mongoDB.
2. A short lived access JWT **(30 min. expiration)** is granted through JSON.

### Making requests

1. Specific HTTP methods that the user performs require an valid access JWT are sent through request headers.
2. Validity of the access JWT is authenticated using [middleware](https://github.com/BvChung/Groupcord/blob/main/backend/middleware/authJWT.js).

### Handling expired access tokens

1. Requests made with expired access tokens will be rejected with a 403.
2. [Axios interceptors](https://github.com/BvChung/Groupcord/blob/main/frontend/src/api/axios.js) will be used to make a request to the
   [/api/refresh](https://github.com/BvChung/Groupcord/blob/main/backend/controller/refresh/refreshTokenController.js) endpoint to grant a new access token using the refresh token to retry the request.
3. The refresh JWT sent as a HTTP only cookie is authenticated.
   1. If the refresh JWT is valid a new access token will be returned and the rejected request will be made again.
   2. If the refresh JWT is invalid then the **user will be logged out**.

### User Logout

1. With user logout the HTTP only cookie will be cleared and removed from the database.

## Demo GIFs

**Messaging**

![Messaging](https://github.com/BvChung/Groupcord/blob/main/demoGifs/GroupcordMessaging.gif)

**Group Creation/Editing**

![Groups](https://github.com/BvChung/Groupcord/blob/main/demoGifs/GroupcordGroupEditing.gif)

**Member Editing**

![Members](https://github.com/BvChung/Groupcord/blob/main/demoGifs/GroupcordMemberEditing.gif)

**Account Settings**

![Settings](https://github.com/BvChung/Groupcord/blob/main/demoGifs/GroupcordAccountEditing.gif)
