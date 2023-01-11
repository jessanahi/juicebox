const { client, getAllUsers } = require('./index');

async function dropTables() {
    try {
      await client.query(`
      DROP TABLE IF EXISTS users;
      `);
    } catch (error) {
      throw error;
    }
  }
  
  async function createTables() {
    try {
      await client.query(`
  
      `);
    } catch (error) {
      throw error;
    }
  };
  
async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }
  };
  
rebuildDB();

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
};

testDB();