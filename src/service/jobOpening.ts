import { Service } from 'typedi';
import { getConnection, getManager } from 'typeorm';
import logger from '@/loader/logger';
import { Company } from '@/model/entities/Company';
import { JobOpening } from '@/model/entities/JobOpening';
import { IJobOpeningDetail, IJobOpeningList } from '@/interface/IJobOpening';
import { escape, unescape } from 'html-escaper';
import { getBoolean } from '@/util/cast';


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
        'jobOpening.id AS jobOpeningId',
        'company.company_name AS companyName',
        'company.country_name AS countryName',
        'company.region_name AS regionName',
        'jobOpening.position AS position',
        'jobOpening.reward AS reward',
        'jobOpening.skill AS skill'
      ])
      .innerJoin(Company, 'company', 'company.id = jobOpening.company_id')
      .getRawMany();

      return list;
    } catch (e) {
      throw e;
    }
  }

  public static async PostJobOpening(bodyData): Promise<string> {
    try {
      // company_id validation
      const company = await getConnection('wanted_pre_dev')
      .getRepository(Company)
      .findOne({ id: bodyData.companyId });

      if (!company) {
        const error = new Error('company validation failed');
        error.name = 'dev';
        throw error;
      }

      // 등록
      const [jobOpeningId] = await getManager('wanted_pre_dev').query(`
      SELECT insert_job_opening(?, ?, ?, ?, ?) AS _id
      `, [
        bodyData.companyId,
        bodyData.position,
        bodyData.reward,
        escape(bodyData.detail),
        bodyData.skill
      ]);

      // validation
      if (jobOpeningId._id.indexOf('JO') < -1) {
        const error = new Error(`post job opening failed`);
        error.name = 'dev';
        throw error;
      }

      return jobOpeningId._id;
    } catch (e) {
      throw e;
    }
  }

  public static async UpdateJobOpening(bodyData): Promise<boolean> {
    try {
      // 공고 id, 회사 id 매칭 validation
      const jobOpeningPost = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .findOne({ id: bodyData.jobOpeningId });

      if (jobOpeningPost.companyId !== bodyData.companyId) {
        const error = new Error(`data validation failed`);
        error.name = 'dev';
        throw error;
      }

      const row = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .update(bodyData.jobOpeningId, { 
        position: bodyData.position,
        reward: bodyData.reward,
        detail: escape(bodyData.detail),
        skill: bodyData.skill 
      });

      return getBoolean(row.affected);
    } catch (e) {
      throw e;
    }
  }

  public static async DeleteJobOpening(bodyData): Promise<boolean> {
    try {
      const row = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .delete({ id: bodyData.jobOpeningId });

      return getBoolean(row.affected);
    } catch (e) {
      throw e;
    }
  }

  public static async GetJobOpeningDetail(queryData): Promise<IJobOpeningDetail> {
    try {
      const detailData = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .createQueryBuilder('jobOpening')
      .select([
        'jobOpening.id AS jobOpeningId',
        'company.company_name AS companyName',
        'company.country_name AS countryName',
        'company.region_name AS regionName',
        'jobOpening.position AS position',
        'jobOpening.reward AS reward',
        'jobOpening.skill AS skill',
        'jobOpening.detail AS detail'
      ])
      .addSelect(subQuery => {
        return subQuery
          .select(`GROUP_CONCAT(DISTINCT subJobOpening.id SEPARATOR ',') AS otherIds`)
          .from(JobOpening, 'subJobOpening')
          .where('subJobOpening.company_id = jobOpening.company_id')
      }, 'otherIdsList')
      .innerJoin(Company, 'company', 'company.id = jobOpening.company_id')
      .where('jobOpening.id = :id', { id: queryData.id })
      .getRawOne();

      detailData.detail = unescape(detailData.detail);
      detailData.otherIdsList = detailData.otherIdsList.split(',');

      return detailData;
    } catch (e) {
      throw e;
    }
  }

  public static async SearchJobOpening(queryData): Promise<Array<IJobOpeningList>> {
    try {
      const list = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .createQueryBuilder('jobOpening')
      .select([
        'jobOpening.id AS jobOpeningId',
        'company.company_name AS companyName',
        'company.country_name AS countryName',
        'company.region_name AS regionName',
        'jobOpening.position AS position',
        'jobOpening.reward AS reward',
        'jobOpening.skill AS skill'
      ])
      .innerJoin(Company, 'company', 'company.id = jobOpening.company_id')
      .where(`
        LOCATE("${queryData.search}", 
        CONCAT_WS(' ',
        company.company_name,
        jobOpening.position,
        jobOpening.skill
        )) > 0
      `)
      .getRawMany();

      return list;
    } catch (e) {
      throw e;
    }
  }  

}
