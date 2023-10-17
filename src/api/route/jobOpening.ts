import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import JobOpeningService from '@/service/jobOpening';
import middleware from '@/api/middleware';

const route = Router();

export default (app: Router) => {
  app.use('/job-opening', route);

  route.get('/list',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const list = await JobOpeningService.GetJobOpeningList();
        return res.status(200).json(list);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

}
