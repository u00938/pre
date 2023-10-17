import { Container } from 'typedi';
import { Logger } from 'winston';
import { getManager } from 'typeorm';
import { User } from '@/model/entities/User';

const attachUser = async (req, res, next) => {
  const Logger: Logger = Container.get('logger');
  try {
    const user = await getManager('wanted_pre_dev').findOne(User, { uid: req.token });

    if (!user) {
      const error = new Error('Unauthorized');
      error.name = 'dev';
      error['status'] = 401;
      throw error;
    }
    req.currentUser = user;
    return next();
  } catch (e) {
    Logger.error('Error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachUser;
