
//run "npm install socketcluster-client" in terminal before attempting to use
var socketCluster = require('socketcluster-client');
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


/*
var CoinLedger = sequelize.define('coinledger', { 
  exch_id: Sequelize.STRING,
  exch_code: Sequelize.STRING,
  exch_name: Sequelize.STRING,
  mkt_id: Sequelize.STRING,
  exchmkt_id: Sequelize.STRING,
  display_name: Sequelize.STRING,
  mkt_name: Sequelize.STRING,
  primary_curr: Sequelize.STRING,
  base_curr: Sequelize.STRING,
  last_price: Sequelize.STRING,
  btc_volume_24: Sequelize.STRING,
  volume_24: Sequelize.STRING,
  ticker_users: Sequelize.STRING });
*/

var api_credentials =
{
    "apiKey"    : "fd29b160d8be6d2ca779361c0b90186b",
    "apiSecret" : "d46f6bde390ec1e5c3a0cf3821e6f315"
}

var options = {
    hostname  : "sc-02.coinigy.com",    
    port      : "443",
    secure    : "true"
};

console.log(options);
var SCsocket = socketCluster.connect(options);


SCsocket.on('connect', function (status) {
    
    console.log(status); 
    
    SCsocket.on('error', function (err) {
        console.log(err);
    });    
    

    SCsocket.emit("auth", api_credentials, function (err, token) {        
        
        if (!err && token) {            

            /*
            var scChannel = SCsocket.subscribe("TRADE-OK--BTC--CNY");
            console.log(scChannel);
            scChannel.watch(function (data) {
                console.log(data);
            });
            */     

            var scChannel = SCsocket.subscribe("TICKER");
            console.log(scChannel);
            scChannel.watch(function (data) {
                //console.log(data);
                sequelize.sync().then(function() {
                  return CoinLedger.create(data);
                }).then(function(coinLedgerResult) {
                  console.log("#############");  
                  console.log(coinLedgerResult.get({
                    plain: true
                  }));
                });
            });   
            
            SCsocket.emit("exchanges", null, function (err, data) {
                if (!err) {                  
                    console.log(data);
                } else {
                    console.log(err)
                }   
            });
            
            
            SCsocket.emit("channels", "OK", function (err, data) {
                if (!err) {
                    console.log(data);
                } else {
                    console.log(err)
                }   
            }); 
        } else {
            console.log(err)
        }   
    });   
});




