# codecatemy cat pic uploader 🐈 🖼️

## Documentation

### Installation

```
git clone https://github.com/medhatnar/codecatemy.git
cd codecademy
```
**Install dependencies**:

**NPM**:
`npm install`

**Yarn**:
`yarn`

## Get API started
`npm start`
or
`yarn start`

## Test

`yarn test`


## API Reference

### Authentication endpoints:
#### POST auth/register - Create a new user account. Params: username, password.

example:

`curl -X POST -H "Content-Type: application/json" -d '{"username": "narsha", "password": "password"}' localhost:3000/auth/register`

#### POST auth/login - Logs in an existing user. Params: username, password. 

(Note: storing session id is necessary for cUrl requests with `-c filename.txt` command. Can be omitted in Postman)

example:

`curl -X POST -H "Content-Type: application/json" -d '{"username": "narsha", "password": "password"}' localhost:3000/auth/login -c cookies.txt`

#### POST auth/logout - Logs out an existing user. Params: none 

(Note: No params required but session data must be sent back with `-b filename.txt`)

example:

`curl -v -X POST localhost:3000/auth/logout -b cookies.txt`

### Cat Endpoints:
(Note: All of these endpoints, except for `GET /cats` require the appropriate user to be signed in and send back session data with `-b filename.txt`. Disregard if you are using Postman or a web browser.)

#### POST /cats - Upload one cat pic and get the file back. Params: name(string name of cat), media(path to local file string)

(Note: you can upload the file in Postman as opposed to providing file path)

example:

`curl -v -X POST -F 'media=@/path/to/someCatPic.png' -F "name=Fluffy" localhost:3000/api/cats -b cookies.txt`

#### GET /cats - returns a list of uploaded Cat pics. Params: none

example:

`curl -v -X GET localhost:3000/api/cats`

#### GET /cats/:id - returns the image file of a single Cat that belongs to the signed in user. Params: id (number id of cat)

example:

`curl -v -X GET localhost:3000/api/cats/1 -b cookies.txt`

#### PUT /cats/:id - updates a single Cat's image file and metadata and returns its metadata. Old file will be deleted. Params: id (number id of cat)

example:

`curl -v -X PUT -F 'media=@/path/to/someCatPic.png' -F "name=Fluffy 2.0" localhost:3000/api/cats/4 -b cookies.txt`

#### DELETE /cats/:id - deletes a single Cat entry and its corresponding image file. Params: id (number id of cat)

`curl -v -X DELETE localhost:3000/api/cats/1 -b cookies.txt`

Bonus: returns a list of all Cats that belong to a specific user. Params: id (number id of user)

#### GET /cats/users/:id

example:

`curl -v -X GET  localhost:3000/api/cats/users/1 -b cookies.txt`

## Postman Demo

![2022-05-17 13 16 29](https://user-images.githubusercontent.com/16326269/168874078-085c1305-e657-42e8-8a5e-c0dce70c319b.gif)

## Created by

<table>
<tr>
<td align="center"><a href="https://github.com/narmander"><img src="https://avatars0.githubusercontent.com/u/16326269?s=400&v=4" width="200px;" alt="Picture of Nar Shah"/><br /><b>Nar Shah</b></a></td>
</tr>
</table>
