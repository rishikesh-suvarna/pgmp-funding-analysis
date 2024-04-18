# Funding Analysis - Server


## Tech Stack

**Client:** React

**Server:** Node, Express


## Installation

**Node Version: 18.19.0 (lts/hydrogen)**

1. Install packages with with npm

```bash
  npm i
```

2. Setting up environment variables


Copy & paste the contents of .env.example file into a new .env file and add the environment variables.


3. Once you've set the environment variables locally, you need to run the database migrations

```bash
  npx sequelize-cli db:migrate
```

4. Run the application

```bash
  npm start
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NODE_ENV`: Environment on which the project is running, can be development / production / testing

`PORT`: Port on which you want the application to run

`WHITELIST`: IPs / Domains to which we grant the access to our application for CORS. Ideally address on which your frontend application will run.

`THROTTLING_TIME`: Time taken between each API calls to prevent rate-limiting.

`DB_NAME`: Database Name

`DB_USER`: Database User

`DB_PASSWORD`: Database Password

`DB_HOST`: Database Host

`BACKEND_URL`: URL for our python backend
