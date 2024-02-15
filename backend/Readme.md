# Funding Analysis Backend

Steps to perform before running this application for the first time.

## Installation

- Use the package manager [npm](https://www.npmjs.com/) to install packages.

```bash
npm i
```
- Head to config folder and create a file named 'config.json' and copy contents from 'config.example.json' to 'config.json'

- Change config.json's content according to your environment variables.
- Run Migrations
```
npx sequelize-cli db:migrate
```

## Running The Application
```
npm start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.