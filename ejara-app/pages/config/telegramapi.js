const path = require('path');
// const MTProto = require('@mtproto/core');
 const MTProto = require('@mtproto/core/envs/browser');
const { sleep } = require('@mtproto/core/src/utils/common');
// const api_id = "6301816";
const api_id = "6125005";
// const api_hash = "ad28ac90638842918e22ab083360c214";
const api_hash = "bfd685d2d5254058bad31591dcd37270";

class API {
  constructor() {
    this.mtproto = new MTProto({
      api_id: api_id,
      api_hash: api_hash,
      // storageOptions: {
      //   path: path.resolve(__dirname, './data/1.json'),
      // },
    });

    // this.mtproto.updates.on('updatesTooLong', (updateInfo) => {
    //     console.log('updatesTooLong:', updateInfo);
    //   });

    //   this.mtproto.updates.on('updateShortMessage', (updateInfo) => {
    //     console.log('updateShortMessage:', updateInfo);
    //   });
      
    //   this.mtproto.updates.on('updateShortChatMessage', (updateInfo) => {
    //     console.log('updateShortChatMessage:', updateInfo);
    //   });
      
    //   this.mtproto.updates.on('updateShort', (updateInfo) => {
    //     console.log('updateShort:', updateInfo);
    //   });
      
    //   this.mtproto.updates.on('updatesCombined', (updateInfo) => {
    //     console.log('updatesCombined:', updateInfo);
    //   });
      
    //   this.mtproto.updates.on('updates', (updateInfo) => {
    //     console.log('updates:', updateInfo);
    //   });
      
    //   this.mtproto.updates.on('updateShortSentMessage', (updateInfo) => {
    //     console.log('updateShortSentMessage:', updateInfo);
    //   });
  }

  async call(method, params, options = {}) {
    try {
      const result = await this.mtproto.call(method, params, options);

      return result;
    } catch (error) {
      console.log(`${method} error:`, error);

      const { error_code, error_message } = error;

      if (error_code === 420) {
        const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === 303) {
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      return Promise.reject(error);
    }
  }

  
}

const api = new API();

module.exports = api;