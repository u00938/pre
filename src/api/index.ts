import { Router } from 'express';
import jobOpening from './route/jobOpening';
import jobApply from './route/jobApply';

export default () => {
  const app = Router();
  
  jobOpening(app);
  jobApply(app);

  return app;
}