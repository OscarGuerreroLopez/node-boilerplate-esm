/* eslint-disable @typescript-eslint/no-magic-numbers */
import app from './app';
import { envs } from './core/config/env';

const port = envs.PORT !== 0 ? envs.PORT : 3001;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Server running on port ${port}... Platform: ${envs.PLATFORM}.... Environment: ${envs.NODE_ENV}...`);
  /* eslint-enable no-console */
});
