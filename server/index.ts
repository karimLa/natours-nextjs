import { dev, port } from './constants';
import next from 'next';
import server from './server';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    // tslint:disable-next-line:no-console
    console.log(
      `> Ready on http://localhost:${port} as ${
        dev ? 'development' : process.env.NODE_ENV
      }`
    );
  });
});
