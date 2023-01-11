const { client, getAllUsers } = require('./index');

async function dropTables() {
  try {
    console.log('Starting to drop tables...');

    await client.query(`
      DROP TABLE IF EXISTS users;
      `);

    console.log('Finished dropping tables!');
  } catch (error) {
    console.error('Error dropping tables.');
    throw error;
  }
}

async function createTables() {
  try {
    console.log('Starting to build tables...');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
        );
      `);

    console.log('Finished building tables!');
  } catch (error) {
    console.error('Error building tables.');
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    client.connect();

    const { rows } = await client.query(`SELECT * FROM users;`);

    console.log(rows);
  } catch (error) {
    console.error(error);
  } finally {
    client.end();
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
