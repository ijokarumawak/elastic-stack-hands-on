'use strict';

const express = require('express');
const { Client } = require('@elastic/elasticsearch');
const https = require('https');

const PORT = 8080;
const HOST = '0.0.0.0';

const es = process.env.ELASTIC_CLOUD_ID != 'DEPLOYMENT_NAME:XXXX' ? new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD
  }
}) : null;

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});

const sendEsResult = (err, expRes, esRes, callback) => {
  if (err) {
    console.log(err);
    expRes.send(err);
  } else {
    callback(expRes, esRes);
  }
}

const renderEsResult = (err, expRes, esRes) => {
  console.log(JSON.stringify({
    err:err,
    req: {
      url: expRes.req.url,
      method: expRes.req.method,
      param: expRes.req.params,
      query: expRes.req.query
    },
    esRes:esRes
  }));
  sendEsResult(err, expRes, esRes, (expRes, esRes) => {
   expRes.send(esRes);
  });
}

app.get('/es', (req, res) => {
  es.search({
    index: 'filebeat-*',
    body: {
      query: {
        match: { hello: 'world' }
      }
    }
  }, (err, result) => renderEsResult(err, res, result));
});

app.get('/has-privileges', (req, res) => {
  es.security.hasPrivileges({
    body: {
      cluster: ['monitor',
        'manage_ilm',
        'manage_ingest_pipelines',
        'manage_index_templates'],
      index: [
        {
          names: ['filebeat-*', 'metricbeat-*', 'es-hands-on'],
          privileges: ['read', 'write']
        }
      ],
      applications: [
        {
          application: 'kibana-.kibana',
          resources: ['space:es-hands-on'],
          privileges: ['login:']
        }
      ]
    }
  }, (err, result) => renderEsResult(err, res, result.body));
});

// TODO: get id of es-hands-on-xxx dashboard.
// TODO: find url shortener using the dashboard id.
app.get('/dashboard', (req, res) => {
  https.get(`https://${process.env.ELASTIC_USERNAME}:${process.env.ELASTIC_PASSWORD}@${process.env.KIBANA_HOST}:9243/s/es-hands-on/api/saved_objects/_find?type=dashboard&search_fields=title&search=${process.env.HANDS_ON_KEY}-dashboard`, (kibanaRes) => {
    console.log(kibanaRes.statusCode);
    const statusCode = kibanaRes.statusCode;
    let body = '';
    kibanaRes.on('data', (data) => {
      body += data.toString('utf8');
    });
    kibanaRes.on('end', () => {
      if (statusCode === 200) {
        const searchResult = JSON.parse(body);
        console.log(searchResult);
        if (searchResult.total === 1) {
          res.status(statusCode).write(JSON.stringify(searchResult.saved_objects[0]));
        } else {
          res.status(404).write(JSON.stringify({message: 'Dashboard was not found.'}));
        }
      } else {
        res.status(statusCode).write(body);
      }
      res.end();
    });
    kibanaRes.on('err', (err) => res.err(err));
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);