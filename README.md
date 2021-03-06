# Node Proxy
A super simple proxy for when you need one in a pinch.

## How to use

1. Install [Node.js](http://nodejs.org/).
1. Download [this repo](https://github.com/catdad/node--proxy/archive/master.zip) and unzip it.
1. Run `npm install`
1. Edit `config.json` to add your proxy table, as such:

   ```json
   [{
        "localPort": 8888,
        "remoteProtocol": "http",
        "remoteHost": "127.0.0.1",
        "remotePort": 80
   }]
   ```

   _This will result in sending all `localhost:8888` traffic to `127.0.0.1:80`._

1. Run using `node app.js`.

You can add multiple proxy targets, as long as they all have a unique local port.
