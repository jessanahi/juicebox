const {
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  getAllPosts,
  updatePost,
  getUserById,
} = require('./index');

async function dropTables() {
  try {
    console.log('Starting to drop tables...');

    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
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
    console.log('Starting to create tables...');

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
        );
      `);

    await client.query(`
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
        );
      `);

    await client.query(`
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) UNIQUE NOT NULL
        );
      `);

    await client.query(`
          CREATE TABLE post_tags (
            "postId" INTEGER REFERENCES posts(id),
            "tagId" INTEGER REFERENCES tags(id)
          );
      `);

    console.log('Finished creating tables!');
  } catch (error) {
    console.error('Error creating tables.');
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log('Starting to create users...');

    await createUser({
      username: 'albert',
      password: 'bertie99',
      name: 'Albert',
      location: 'LA',
    });

    await createUser({
      username: 'sandra',
      password: '2sandy4me',
      name: 'Sandra',
      location: 'OH',
    });

    await createUser({
      username: 'glamgal',
      password: 'soglam',
      name: 'Lana',
      location: 'NY',
    });

    console.log('Finished creating users!');
  } catch (error) {
    console.error('Error creating users.');
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, Sandra, glamgal] = await getAllUsers();

    console.log('Starting to create user posts...');
    await createPost({
      authorId: albert.id,
      title: 'First Post',
      content: 'WHAT IS HAPPENING????',
    });

    await createPost({
      authorId: Sandra.id,
      title: 'Ghost Post',
      content: 'SERIOUSLLY WAT IS HAPPENING WHY ARE WE ALIVE',
    });

    await createPost({
      authorId: glamgal.id,
      title: 'Cat Post',
      content: 'IM CAT HOW CAN I MROW HELP IT HURTS',
    });

    console.log("Finished creating users' posts!");
  } catch (error) {
    console.error('Error creating these posts.');
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
  } catch (error) {
    console.error('Error trying to rebuild DB.');
    throw error;
  }
}

async function testDB() {
  try {
    console.log('BEEPBEEP Starting to test database...');

    const users = await getAllUsers();
    console.log('getAllUsers:', users);

    const updateUserResult = await updateUser(users[0].id, {
      name: 'Lisa Simpson',
      location: 'Springfield',
    });
    console.log('Result:', updateUserResult);

    const posts = await getAllPosts();
    console.log('Result:', posts);

    const updatePostResult = await updatePost(posts[0].id, {
      title: 'New New Post Post',
      content:
        'Mew mew kissy cutie 2 is neither kissy nor cutie,, its TrASh,,, 0 stars',
    });
    console.log('Result:', updatePostResult);

    const albert = await getUserById(1);
    console.log('Result:', albert);

    console.log('BEEPBEEP Finished database tests!');
  } catch (error) {
    console.error('Error testing database.');
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
