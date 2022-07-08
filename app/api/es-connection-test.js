const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  cloud: {
    id: 'demo:YXNpYS1ub3J0aGVhc3QxLmdjcC5jbG91ZC5lcy5pbzo0NDMkNTljNWI3MjYxNDM1NDk5MzkwZjIwNzg0NDFlZWEzNTQkN2Q3NjRhNzc1YTg4NDhhNmIxOTllYTRjZWE1MzMwYTI='
  },
  auth: {
    username: 'es-hands-on',
    password: 'Password!123'
  }
})

async function run_a() {
  res = await client.search({
    index: 'filebeat-*',
    query: {
      match: {
        quote: 'winter'
      }
    }
  });
  console.log(res);
}


async function search() {
  console.log('querying');
  client.search({
    index: 'filebeat-*',
    query: {
      match: {
        quote: 'winter'
      }
    }
  }).then((res) => {
    console.log('SUCCESS', res);
  }, (err) => {
    console.log('FAILED', err);
  });

  client.search({
    index: 'filebeat-*',
    query: {
      malformed_query: {
        quote: 'winter'
      }
    }
  }).then((res) => {
    console.log('SUCCESS', res);
  }, (err) => {
    console.log('FAILED', err);
  });

}

async function exec() {
  search();
  await new Promise(resolve => setTimeout(resolve, 5000));
  // run_a();
}

exec();

