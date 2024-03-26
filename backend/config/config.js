module.exports = {
    "development": {
      "username": process.env.DB_USER,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME,
      "host": process.env.DB_HOST,
      "dialect": "postgres",
      "logging": false
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "localhost",
      "dialect": "postgres"
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "localhost",
      "dialect": "postgres"
    }
}