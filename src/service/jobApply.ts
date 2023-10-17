import { Service } from 'typedi';
import { getConnection } from 'typeorm';
import logger from '@/loader/logger';
import { Company } from '@/model/entities/Company';


@Service()
export default class JobApplyService {
  constructor() {
  }

  public static async getJobOpeningList(): Promise<Object[]> {
    try {
      const example = await getConnection('wanted_pre_dev').getRepository(Company)
      .find();

      return example;
    } catch (e) {
      throw e;
    }
  }
}
