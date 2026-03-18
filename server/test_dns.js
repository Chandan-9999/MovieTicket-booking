import * as dns from 'dns';
import * as fs from 'fs';

const url = 'cluster0.ecrc3se.mongodb.net';

dns.resolveSrv('_mongodb._tcp.' + url, (err, addresses) => {
  if (err) {
    fs.writeFileSync('dns_out.txt', 'Error: ' + err.message);
  } else {
    fs.writeFileSync('dns_out.txt', JSON.stringify(addresses, null, 2));
  }
});
