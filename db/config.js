require('dotenv').config();

module.exports = {
  'development': {
    'dialect': 'postgres',
    'host': process.env.DB_HOST || 'localhost',
    'port': process.env.DB_PORT || 5432,
    'database': process.env.DB_DATABASE || 'tate-modern',
    'username': process.env.DB_USER,
    'password': process.env.DB_PW
  },
  'test': {
    'dialect': 'sqlite',
    'storage': ':memory:',
    // Sequelize's query logging makes it almost impossible to read test output
    'logging': false
  }
};
