import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import logger from '@/loader/logger';
import { Company } from '@/model/entities/Company';
import { JobOpening } from '@/model/entities/JobOpening';
import { IJobOpeningList } from '@/interface/IJobOpening';


@Service()
export default class JobOpeningService {
  constructor() {
  }

  public static async GetJobOpeningList(): Promise<Array<IJobOpeningList>> {
    try {
      const list = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .createQueryBuilder('jobOpening')
      .select([
        ''
      ])
      .getRawMany();

      return list;
    } catch (e) {
      throw e;
    }
  }

  public static async PostJobOpening(): Promise<Object[]> {
    try {
      const example = await getConnection('wanted_pre_dev').getRepository(Company)
      .find();

      return example;
    } catch (e) {
      throw e;
    }
  }

}
