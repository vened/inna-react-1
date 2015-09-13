/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import request from 'superagent';
import ExecutionEnvironment from 'fbjs/lib/ExecutionEnvironment';

const getUrl = path => path.startsWith('http') ?
  path : ExecutionEnvironment.canUseDOM ? path :
    process.env.WEBSITE_HOSTNAME ?
      `http://${process.env.WEBSITE_HOSTNAME}${path}` :
      `http://127.0.0.1:${global.server.get('port')}${path}`;

const HttpClient = {

  get: path => new Promise((resolve, reject) => {
    request
      .get(getUrl(path))
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          if (err.status === 404) {
            resolve(null);
          } else {
            reject(err);
          }
        } else {
          //console.log('HttpClient resolve');
          resolve(res.body);
        }
      });
  })

};

export default HttpClient;
