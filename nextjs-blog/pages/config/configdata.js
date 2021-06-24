const path = require('path');
const MTProto = require('@mtproto/core');

const api_id = "6301816";
const api_hash = "ad28ac90638842918e22ab083360c214";

// 1. Create instance
const mtproto = new MTProto({
  api_id,
  api_hash,

  storageOptions: {
    path: path.resolve(__dirname, './data/1.json'),
  },
}); // with node env


// 2. Print the user country code
mtproto.call('help.getNearestDc').then(result => {
  console.log('country:', result.country);
});