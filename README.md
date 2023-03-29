# node-token-auth-server-example
Token auth server demo in nodejs

## Installation

```
$ git clone https://github.com/thoughtspot/node-token-auth-server-example
$ cd node-token-auth-server-example
$ npm i
```

## Usage

```
$ TS_SECRET_KEY=<secret-key> TS_HOST=<ts-host-server> PORT=3030 npm start
```

Now, you should be able to access the below endpoints:

- `http://localhost:3030/api/gettoken/:user` [GET/POST]
- `http://localhost:3030/api/v2/gettoken/:user` [GET/POST]

In the POST body, one could send the below params:

- groups: string[] # Array of groupIds which will be assigned to this user. If empty, then the current groups are maintained.
