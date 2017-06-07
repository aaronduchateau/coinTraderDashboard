'use strict';
// setup db stuff
var Sequelize = require('sequelize');
var sequelize = new Sequelize('altcoindata', 'aaron', '', {dialect: 'postgres'});

var CoinLedger = sequelize.define('coinledgerdata', { 
  exch_id: Sequelize.INTEGER,
  exch_code: Sequelize.STRING,
  exch_name: Sequelize.STRING,
  mkt_id: Sequelize.INTEGER,
  exchmkt_id: Sequelize.INTEGER,
  display_name: Sequelize.STRING,
  mkt_name: Sequelize.STRING,
  primary_curr: Sequelize.STRING,
  base_curr: Sequelize.STRING,
  last_price: Sequelize.DECIMAL,
  btc_volume_24: Sequelize.DECIMAL,
  volume_24: Sequelize.DECIMAL,
  ticker_users: Sequelize.STRING });

const Hapi = require('hapi');
const _ = require('lodash');
const pkg = require('./package.json');

// create the [formerly] Walmart Labs Hapi Server
const PORT = process.env.PORT || 8000;
const server = new Hapi.Server();
server.connection({ port: PORT });

// useful Hapi plugins
// to generate API documentation, use the hapi-swagger plugin
const plugins = [
  require('h2o2'),
  require('inert'),
  require('vision'),
  require('blipp')
];

server.register(plugins, err => {
  if (err) {
    throw err;
  }

  console.log('=> Registered plugins:', {
    plugins: _.keysIn(server.registrations).join(', ')
  });

  // serve up all static content in public folder
  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: {
      directory: {
        path: './public',
        listing: false,
        index: true
      }
    }
  });

  // serve up some sample JSON data
  server.route({
    method: 'GET',
    path: '/data',
    handler: (request, reply) => {
      reply({
        name: pkg.name,
        version: pkg.version,
        message: 'Welcome to Mullet!'
      });
    }
  });

  // serve up some sample JSON data
  server.route({
    method: 'GET',
    path: '/altcoindata',
    handler: (request, reply) => {
      CoinLedger.findAll().then(function(users) {
        reply(users);
      })
    }
  });

  server.start(err => {
    if (err) {
      throw err;
    }
    console.log(`=> Mullet Stack running at: ${server.info.uri}`);
  });
});

// for server inject in Lab tests
module.exports = server;
