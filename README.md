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

### Get API started
`npm start`
or
`yarn start`

## API Reference

#### Cat Endpoints:
`POST /cats`

`GET /cats`

`GET /cats/:id`

`PUT /cats/:id`

`DELETE /cats/:id`

Bonus: Get cats that belong to a specific user, ONLY if that user is signed in.

`GET /cats/users/:id`

#### Authentication:
`POST /register`

`POST /login`

`POST /logout`

## Usage

Since sessions are used for authentication, please utilize Postman.

1.  `curl -X POST -H "Content-Type: application/json" -d '{"username": "narsha", "password": "password"}' localhost:3000/auth/login`


## Created by

<table>
<tr>
<td align="center"><a href="https://github.com/narmander"><img src="https://avatars0.githubusercontent.com/u/16326269?s=400&v=4" width="200px;" alt="Picture of Nar Shah"/><br /><b>Nar Shah</b></a></td>
</tr>
</table>
