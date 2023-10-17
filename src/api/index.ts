import { Router } from 'express';
import jobOpening from './route/jobOpening';

export default () => {
  const app = Router();
  jobOpening(app);

  return app;
}