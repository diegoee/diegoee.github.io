var cordova = require('cordova-bridge');
cordova.channel.on('message',function(msg){
  try { 
    console.log('cordova channel message: '+msg);
    cordova.channel.send('msg recived: '+msg);
  }catch (err){
    cordova.channel.send("Error: " + JSON.stringify(err) + " => " + err.stack );
  }
});
// Inform cordova node is initialized.
cordova.channel.send("Node was initialized. Versions: " + JSON.stringify(process.versions));