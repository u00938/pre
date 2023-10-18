import { NextFunction, Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { celebrate, Joi } from 'celebrate';
import { Logger } from 'winston';
import JobOpeningService from '@/service/jobOpening';
import middleware from '@/api/middleware';

const route = Router();

export default (app: Router) => {
  app.use('/job-opening', route);

  // 채용공고 목록 조회
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

  // 채용공고 등록
  route.post('/',
    celebrate({
      body: Joi.object({
        companyId: Joi.string().required(),
        position: Joi.string().required(),
        reward: Joi.number().required(),
        detail: Joi.string().required(),
        skill: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await JobOpeningService.PostJobOpening(req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  // 채용공고 수정
  route.put('/',
    celebrate({
      body: Joi.object({
        jobOpeningId: Joi.string().required(),
        companyId: Joi.string().required(),
        position: Joi.string().required(),
        reward: Joi.number().required(),
        detail: Joi.string().required(),
        skill: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await JobOpeningService.UpdateJobOpening(req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  // 채용공고 삭제
  route.delete('/',
    celebrate({
      body: Joi.object({
        jobOpeningId: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await JobOpeningService.DeleteJobOpening(req.body);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  // 채용공고 상세 페이지 조회
  route.get('/detail',
    celebrate({
      query: Joi.object({
        id: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await JobOpeningService.GetJobOpeningDetail(req.query);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );

  // 채용공고 검색
  route.get('/',
    celebrate({
      query: Joi.object({
        search: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger: Logger = Container.get('logger');

      try {
        const result = await JobOpeningService.SearchJobOpening(req.query);
        return res.status(200).json(result);
      } catch (e) {
        logger.error('error %o', e);
        return next(e);
      }
    }
  );  

}