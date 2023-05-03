# Backend API Documentation
This is the API documentation where you will be able to find information on all the endpoints for the "*Online Training Schedule*" project.
For data base i used [MongoDB](https://www.mongodb.com/) 

## Used dependencies:
- Express
- Mongoose
- bcrypt
- jsonwebtoken
- cors
- sharp


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
The base URL is: **localhost:3030/** and depending on what you need, there are different paths.
There are 6 different main paths, which are:
-  **baseURL/users**
-  **baseURL/posts**
-  **baseURL/chat**
-  **baseURL/images**
-  **baseURL/training**
-  **baseURL/calendar**

## Auth Service

### Authentication

If there is an error with token, the service will respond with ```{ message: "Unauthorized!" }```

#
- [x] **REGISTER**

Send a ```POST``` request to ```/users/register``` with properties ```username```, ```password```, ```repeat password``` and upload a ```profile picture```. Then you can log in!

> Example
```
{
  "username": "admin",
  "password": "123456",
  "rePassword": "123456",
  "image": "Your upload image here!"
}
```
**NOTE:** The image should be upload аnd the client will automatically convert it to base64, the server doesn't work URL!

**NOTE:** If the username is already exist, the service will respond with ```{ message: "Username already exist!" }```
#
- [x] **LOGIN**

Send a ```POST``` request with ```username``` and ```password``` to ```/users/login```. The service will respond with an object, containing a standard string ```token```, that can be used for requests.

> Example
```
{
  "username": "admin",
  "password": "123456",
}
```

**NOTE:** If username or password is incorrect, the service will respond with ```{ message: "Username or password don't match!" }```
#
- [x] **To get user**

Send ```GET``` request with ```token``` and ```userId``` to ```/users/:token/:userId```. The service will respond with all information about the current user!

> Example
```
/users/eyJhbGciOiJIUzI1NiIsInR5.../62e90e2e061f1a3c90bab962
```

**NOTE:** If there is no user, the service will respond with ```{ message: "User doesn't exist!" }```
#
- [x] **To get all users**

Send ```GET``` request to ```/users```

**NOTE:** If there is no users, the service will respond with ```{ message: "Empty" }```
#
- [x] **To get all users by username (Search)**

Send ```GET``` request with ```token``` and ```searchValue``` to ```/users/getUserByUsernames/:token/:searchValue```

> Example
```
/users/getUserByUsernames/eyJhbGciOiJIUzI1NiIsInR5.../62e90e2e061f1a3c90bab962
```

**NOTE:** If there is no users, the service will respond with ```{ message: "Empty" }```
#
- [x] **To get posts/trainigs/saved posts/saved trainings in profile**

Send ```GET``` request with ```token```, ```option``` and  ```userId``` to ```/own/:token/:option/:userId```

Option can be: ```ownPosts```, ```trainings```, ```savedPosts``` and ```savedTrainings```

> Example
```
/users/own/eyJhbGciOiJIUzI1NiIsInR5.../ownPosts/62e90e2e061f1a3c90bab962
```

**NOTE:** If there is no items for this user, the service will respond with ```{ message: "Empty" }```
#
- [x] **Delete user account**

Send ```DELETE``` request with ```userId``` to ```/users/deleteAccount/:token```

And the body must contain only ```token```

> Example
```
{
  token: "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid Access Token```, ```User doesn't exist!``` and ```You cannot delete this account!```
#
- [x] **Toggle follow/unfollow curr user**

Send ```GET``` request with ```token```, ```userId``` to ```/toggleFollow/:token/:userId```

> Example
```
  /users/toggleFollow/eyJhbGciOiJIUzI1NiIsInR5.../62e90e2e061f1a3c90bab962
```

**POSSIBLE ERRORS:** ```Invalid Access Token```, ```User not found!```
#
- [x] **Edit your profile**

Send ```PUT``` request with ```userId``` to ```/editProfile/:userId```

The body must contain:
> Example
```
  values {
          username: Your username here,
          password: Your password here,
          newPassword: New password || '',
          location: User location || '',
          image: User profile image || ''
          }
  userId: 62e90e2e061f1a3c90bab962
  token: eyJhbGciOiJIUzI1NiIsInR5...
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid Access Token```, ```User doesn't exist!``` or some of values can be incorrect!



## Post Service
- [x] **To create a new post**

Send ```POST``` request to ```/posts/create```

And the body must contain object with ```values``` and ```token```

> Example
```
values: {
  description: "Some desc here",
  images: [Your upload images here],
  select: 'Public/Friends/Private'
},
token: eyJhbGciOiJIUzI1NiIsInR5...
```

**NOTE:** The images should be upload аnd the client will automatically convert it to base64, the server doesn't work URL!
**POSSIBLE ERRORS:** ```Invalid Access Token```, ```User doesn't exist!``` or some of values can be incorrect!
#
- [x] **To delete post**

Send ```DELETE``` requst with ```postId``` to ```/posts/deletePost/:postId```

And the body must contain an object with ```postId``` and ```token```

> Example
```
{
  cookie: "Cookie information here...",
  postId: 62e90e2e061f1a3c90bab962
}
```

**NOTE:** This will delete all information about post and comments inside and from user!
**POSSIBLE ERRORS:** ```Invalid Access Token```, ```User doesn't exist!```, ```Post not found!```, ```You cannot change this post!```
#
- [x] **Get all public posts**

Send a ```GET``` request ```pageNum``` to ```/posts/:pageNum```

Page num is for skip posts number
if u send 0 u will get first 10 posts, if u send 10 u will skip first 10 and get after this and tc..

**POSSIBLE ERRORS:** ```Empty```
#
- [x] **Get all firends posts**

Send a ```GET``` request with ```pageNum``` and ```token``` to ```/friendsPosts/:pageNum/:token```

Page num is for skip posts number
Page num: if u send 0 u will get first 10 posts, if u send 10 u will skip first 10 and get after this and tc..

**POSSIBLE ERRORS:** ```Empty```
#
- [x] **Details post**

Send ```GET``` request with ```postId``` and ```token``` to ```/posts/details/:postId/:token```

**POSSIBLE ERRORS:** ```Post not found``` or ```404 not found```
#
- [x] **Edit post**

Send ```PUT``` request with ```postId``` to ```/posts/editPost/:postId```

And the body must contain object with ```postValues```, ```postId``` and ```token```

> Example
```
  postValues: 
          {
          description: Your desc here,
          images: [Your upload images here],
          select: 'Public'
          },
  postId: 62e90e2e061f1a3c90bab962,
  token: eyJhbGciOiJIUzI1NiIsInR5...
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid access token```, ```User not found!```, ```Post not found / 404 not found!``` and ```You cannot change this post!```
#
- [x] **Like/Unlike post**

Send a ```POST``` request with ```postId``` to ```/posts/toggleLikePost/:postId```

And the body must contain object with ```postId``` and  ```token```

> Example
```
{
  postId: "62e90e2e061f1a3c90bab962",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2..."
}
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid access token```, ```User doesn't exist!```, ```Post not found / 404 not found!``` and ```You cannot like this post!```
#
- [x] **To save post**

Send a ```POST``` request with ```postId``` to ```/posts/toggleSavePost/:postId```

And the body must contain object with ```postId``` and  ```token```

> Example
```
{
  postId: "62e90e2e061f1a3c90bab962",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2..."
}
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid access token```, ```User doesn't exist!```, ```Post not found / 404 not found!``` and ```You cannot save this post!```
#
- [x] **Add comment**

Send ```POST``` request with ```commentId``` to ```/posts/addComment```

The body must contain object with ```data```

> Example
```
{
data = {
        description: Your desc here,
        image: [Upload 1 image if u want],
        token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...,
        userId: 62e90e2e061f1a3c90bab962,
        postId: 62e90e2e061f1a3c90bab923
        }
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid access token```, ```This comment doesn't exist!``` and ```You cannot change this comment!```
#
- [x] **Edit comment**

Send ```PUT``` request with ```commentId``` to ```/posts/editComment/:commentId```

The body must contain object with ```token```, ```commentValue``` and ```commentId```

> Example
```
data = {
        token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...,
        commentValue: 62e90e2e061f1a3c90bab962,
        commentId: 62e90e2e061f1a3c90bab923
        }
```

**POSSIBLE ERRORS:** ```Unauthorized!```, ```Invalid access token```, ```This comment doesn't exist!``` and ```You cannot change this comment!```
#

- [x] **Like/Unlike comment/nested comment**

Send ```POST``` request with ```commentId``` to ```/posts/likeComment/:commentId```

The body must contain object with ```commentId``` and ```token```

> Example
```
{
  commentId: 62e90e2e061f1a3c90bab962
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...,
}
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```This comment doesn't exist!``` and ```You cannot like/unlike this comment!```
#
- [x] **Delete comment**

Send ```DELETE``` request with ```commentId``` to ```/posts/deleteComment/:commentId/:parentId```

And the body must contain object with ```commentId```, ```parentId```, ```token```

Parend id: if parentId == undefined then commentId is a main comment, if parentId is exist then commentId is for nestedComment!

> Example
```
 data = {
        commentId: 62e90e2e061f1a3c90bab962,
        token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...,
        parentId: 62e90e2e061f1a3c90bab911
        }
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```This comment doesn't exist!``` and ```You cannot delete this comment!```
#
- [x] **Reply to comment**

Send ```POST``` request with ```commentId``` to ```/posts/addReplyComment/:commentId```

And the body must contain object with ```token```, ```commentId``` and ```commentValue```, ```image```, ```userId``` and ```postId```

> Example
```
 data = {
        commentValue: 'Your comment value here,
        image: '',
        commentId: 62e90e2e061f1a3c90bab912,
        userId: 62e90e2e061f1a3c90bab941,
        postId: 62e90e2e061f1a3c90bab991,
        token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
        }
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```This comment doesn't exist!```
#
- [x] **Get comments for curr post**

Send a ```GET``` request with ```postId``` and ```token``` to ```/posts/getComments/:postId/:token```

**POSSIBLE ERRORS:** ```Empty```
#
- [x] **Get nested comments for curr comment**

Send a ```GET``` request with ```postId```, ```commentId``` and ```token``` to ```/posts/getNestedComments/:postId/:commentId/:token```

**POSSIBLE ERRORS:** ```Empty```


## Images Service
- [x] **Get full image size**

Send a ```GET``` request with ```imageId``` and ```token``` to ```/images/:imageId/:token```

**POSSIBLE ERRORS:** ```Image not found!```
#


## Chat Service
- [x] **Create new chat**

Send ```POST``` request to ```/chat```

And the body must contains ```token```, ```senderId``` and ```receiverId```

> Example
```
    senderId: 62e90e2e061f1a3c90bab941,
    receiverId: 62e90e2e061f1a3c90bab991,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```
#
- [x] **Get all chats for curr user**

Send a ```GET``` request with ```userId``` to ```/chat/:userId```

**POSSIBLE ERRORS:** ```User doesn't exist!```,```Chats not found!```
#
- [x] **Get curr chat**

Send a ```GET``` request with ```firstId``` and ```secondId``` to ```/chat/find/:firstId/:secondId```

**POSSIBLE ERRORS:** ```User doesn't exist!```,```Chats not found!```
#
- [x] **Get messages for curr chat**

Send a ```GET``` request with ```chatId``` and ```skipNumber``` to ```/chat/message/:chatId/:skipNumber```

Skip number = Skip messages
if u send 0 u will get first 10 messages, if u send 10 u will skip first 10 and get after this and tc..

**POSSIBLE ERRORS:** ```User doesn't exist!```,```Chats not found!```
#
- [x] **Create message**

Send a ```POST``` request to ```/chat/message```

And the body must contains ```token``` and ```message```

> Example
```
message = {
          senderId: 62e90e2e061f1a3c90bab991,
          text: Your message here,
          chatId: 62e90e2e061f1a3c90bab941,
          image: Your upload image here
          },
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```User doesn't exist!```,```Chats not found!```
#
- [x] **Delete message**

Send a ```DELETE``` request with ```messageId``` to ```/chat/deleteMessage/:messageId```

And the body must contains ```token```

> Example
```
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```User doesn't exist!```,```Chats not found!``` and ```Message not found!```
#

## Calendar Service
- [x] **Init calendar**

If doesn't exist curr year for curr user, u can:

Send ```GET``` request with ```token```, ```year``` and ```month``` to ```/calendar/:token/:year/:month```

> Example
```
    year: 2023,
    month: OPTIONAL || 'February',
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```
#
- [x] **Get curr day**

If doesn't exist this day, then will automatically create a new one!

Send ```GET``` request with ```token```, ```year```, ```month``` and ```day``` to ```/calendar/:token/:year/:month/:day```

> Example
```
    day: 7,
    year: 2023,
    month: 'February',
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```
#
- [x] **Create new event**

If doesn't exist this day, then will automatically create a new one!

Send ```POST``` request with ```token``` to ```/calendar/createEvent/:token```

And the body must contain object with ```token```, ```day```, ```year```, ```month```, ```container```

Container is for event data!

> Example
```
data = {
        container: {
               name: Event name,
               timeFrom: 12:35,
               timeTo: 15:00
        },
        day: 7,
        year: 2023,
        month: 'February',
        token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
      }
```

**POSSIBLE ERRORS:** ```Invalid access token```
#
- [x] **Toggle finish event**

Send ```POST``` request with ```eventId``` to ```/calendar/toggleFinishEvent/:eventId```

And the body must contain object with ```eventId```, ```finish```, ```token```

If finish is true, then send to DB finish: true and the DB will automaticaly convert the opposite of the given

> Example
```
    eventId: 62e90e2e061f1a3c90bab991,
    finish: false/true,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```
#
- [x] **Delete event**

Send ```DELETE``` request with ```eventId``` to ```/calendar/deleteEvent/:eventId```

**POSSIBLE ERRORS:** ```Invalid access token```, ```Event not found!```

## Training Service
- [x] **Get curr Training**

Send ```GET``` request with ```trainingId``` to ```/training/:trainingId```

**POSSIBLE ERRORS:** ```Invalid access token```, ```Training not found/doesn't exist!```
#
- [x] **Get fast info for curr Training**

Send ```GET``` request with ```trainingId``` to ```/training/fastInfo/:trainingId```

**POSSIBLE ERRORS:** ```Invalid access token```, ```Training not found/doesn't exist!```
#
- [x] **Get fast info for curr Training**

Send ```GET``` request with ```imageId``` to ```/training/fullImage/:imageId```

**POSSIBLE ERRORS:** ```Invalid access token```, ```Training not found/doesn't exist!```, ```Training image doesn't exist!```
#
- [x] **Create Training Program**

Send ```POST``` request to ```/training/create```

And the body must contain data with ```mainInputTitle```, ```container```, ```category```, ```visible``` and separately ```token```, ```userId```

mainInputTitle: Training program name
visible: Public/Friends/Private
container: this is for all created inputs like title, desc, restTime, exerciseTime, image...

> Example
```
data = {
        mainInputTitle: Training program name,
        container,
        category: Your category name,
        visible: Public/Friends/Private,
        },
    userId: 62e90e2e061f1a3c90bab991,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or some of values can be incorrect in container!
#
- [x] **Like/Unlike Training program**

Send ```POST``` request with ```trainingId``` to ```/training/toggleLike/:trainingId```

And the body must contains ```token```, ```trainingId```

> Example
```
    trainingId: 62e90e2e061f1a3c90bab991,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or some of values can be incorrect in container!
#
- [x] **Edit training program**

Send ```POST``` request with ```trainingId``` to ```/training/edit-program/:trainingId```

And the body must contain data with ```mainInputTitle```, ```container```, ```category```, ```visible``` and separately ```token```, ```userId```

mainInputTitle: Training program name
visible: Public/Friends/Private
container: this is for all created inputs like title, desc, restTime, exerciseTime, image...

> Example
```
  data = [
      trainingId: 62e90e2e061f1a3c90bab991,
      mainInputTitle: Training program name,
      container,
      category: Your category name,
      containerIds: OPTIONAL [62e90e2e061f1a3c90bab993, 62e90e2e061f1a3c90bab992],
      deleteImagesIds: OPTIONAL [62e90e2e061f1a3c90bab993, 62e90e2e061f1a3c90bab992],
      visible: Public/Friends/Private,
      ]
    userId: 62e90e2e061f1a3c90bab991,
    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or some of values can be incorrect in container!
#
- [x] **Edit training program curr container**

Send ```POST``` request with ```cntId``` to ```/training/editCntValue/:cntId```

And the body must contains ```value```, ```cntId```, ```token```

> Example
```
  cntId: 62e90e2e061f1a3c90bab991,
  value: Cnt value here,
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or some of values can be incorrect!
#
- [x] **Delete Training program**

Send ```DELETE``` request with ```trainingId``` to ```/training/delete/:trainingId```

And the body must contain ```token```

> Example
```
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or ```Training program not found!```
#

## Category Service
- [x] **Get all categories for curr user**

Send ```GET``` request with ```author``` to ```/training/categories/:author```

**POSSIBLE ERRORS:** ```Invalid access token```, ```Training not found/doesn't exist!```
#
- [x] **Get all trainings by category**

Send ```GET``` request with ```categoryId``` to ```/training/trainingsByCategory/:categoryId```

**POSSIBLE ERRORS:** ```Invalid access token```, ```Training not found/doesn't exist!```
#
- [x] **Edit Category name**

Send ```POST``` request with ```categoryId``` to ```/training/editCategoryName/:categoryId```

And the body must contains ```categoryId```, ```token```, ```value```

> Example
```
  categoryId: 62e90e2e061f1a3c90bab991,
  value: New category value here,
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or some of values can be incorrect!
#
- [x] **Delete Category**

Send ```DELETE``` request with ```categoryId``` to ```/training/deleteCategory/:categoryId```

And the body must contain ```token```

NOTE: THIS WILL DELETE ALL TRAINING PROGRAMS INSIDE THE CATEGORY!!!

> Example
```
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2...
```

**POSSIBLE ERRORS:** ```Invalid access token```, ```User doesn't exist!``` or ```Category not found!```



### For all wrong paths, server will respond with ```{ message: 'Error page' }```!
