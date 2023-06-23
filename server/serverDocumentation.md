# Backend API Documentation
This is the API documentation where you will be able to find information on all the endpoints for the "*Tic-Tac-Toe Online*" project.
For data base i used [MongoDB](https://www.mongodb.com/) 

## Used dependencies:
- Express
- Mongoose
- bcrypt
- jsonwebtoken
- cors
- shortId
- uuid


### Instalation and start server in server folder:

### To install all dependencies
```bash
npm i
```

### To start server
```bash
npm start
```

## To start chat socket
### Go to socket folder and then type
```bash
npm start
```

## Base URL
The base URL is: **localhost:3000/** and depending on what you need, there are different paths.
There are 3 different main paths, which are:
-  **baseURL/users**
-  **baseURL/game**
-  **baseURL/chat**

## Auth Service

### Authentication

If there is an error with token, the service will respond with ```{ message: "Unauthorized!" }```

#
- [x] **LOGIN**

Send a ```POST``` request with ```username``` to ```/users/initUser```. The service will respond with an object, containing a standard string ```token```, that can be used for requests.

> Example
```
{
  "username": "admin",
}
```

**NOTE:** If username already exist, the service will respond with ```{ message: "This user already exist!" }```
#
- [x] **To get user**

Send ```GET``` request with ```token``` and ```userId``` to ```/users/getUser/:token```. The service will respond with all information about the current user!

> Example
```
/users/getUser/eyJhbGciOiJIUzI1NiIsInR5...
```

**NOTE:** If there is no user, the service will respond with ```{ message: "User doesn't exist!" }```
#
- [x] **To get all users**

Send ```GET``` request to ```/users```

**NOTE:** If there is no users, the service will respond with ```{ message: "Empty" }```

#
- [x] **To leave user**

Send ```POST``` request to ```/users/leaveUser/:token```

**NOTE:** If the user is not exist, the service will respond with ```{ message: "User doesn't exist!" }```

#
- [x] **To get game statistic**

Send ```GET``` request to ```/users/getGameStatistic```

#
- [x] **To rate us**

Send ```POST``` request with ```token```, ```userId``` and ```rateNum``` to ```/users/rateUs/:token```.

> Example
```
/users/rateUs/eyJhbGciOiJIUzI1NiIsInR5...
```

After successfully rated, the server will respond with ```{ message: "Thank you for your rating!" }```

**NOTE:** If there is no user, the service will respond with ```{ message: "User doesn't exist!" }```

## Chat Service

- [x] **Get messages**

Send a ```GET``` request with ```skipNumber``` to ```/chat/message/:skipNumber```

Skip number = Skip messages
if u send 0 u will get first 10 messages, if u send 10 u will skip first 10 and get after this and tc..

#
- [x] **Send message**

Send a ```POST``` request to ```/chat/sendMessage/:token```

And the body must contains ```token``` and ```message```

> Example
```
message = {
          senderId: 62e90e2e061f1a3c90bab991,
          text: Your message here,
          },
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```User doesn't exist!```

## Game service

- [x] **To get all games**

Send ```GET``` request to ```/game```

#
- [x] **To get curr game**

Send ```GET``` request to ```/game/:gameId/:token```

#
- [x] **To make game/enter room**

Send a ```POST``` request to ```/game/enterRoom/:token```

And the body must contains ```data```

> Example
```
data = {
          gameOption: 'Create',
        }
```

**POSSIBLE ERRORS:** ```User doesn't exist!```

#
- [x] **To set in board**

Send a ```POST``` request to ```/game/setInBoard```

And the body must contains ```data```

> Example
```
data = {
          currentPlayer: "X or O",
          index: 0-8,
          currPlayerName: 'Admin',
          gameId: 'eyJhbGciOiJIUzI1NiIsInR5',
        }
```

**POSSIBLE ERRORS:** ```User doesn't exist!``` and ```Game not found!```

#
- [x] **To leave room**

Send a ```POST``` request to ```/game/leaveRoom/:token```

**POSSIBLE ERRORS:** ```User doesn't exist!``` and ```Game not found!```













