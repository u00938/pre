import { Service } from 'typedi';
import { getConnection, getManager } from 'typeorm';
import { Company } from '@/model/entities/Company';
import { JobOpening } from '@/model/entities/JobOpening';
import { JobApplyHistory } from '@/model/entities/JobApplyHistory';


@Service()
export default class JobApplyService {
  constructor() {
  }

  public static async applyJobOpening(currentUser, bodyData): Promise<Object[]> {
    try {
      // job_opening_id validation
      const jobOpening = await getConnection('wanted_pre_dev')
      .getRepository(JobOpening)
      .findOne({ id: bodyData.jobOpeningId });

      if (!jobOpening) {
        const error = new Error('jobOpening validation failed');
        error.name = 'dev';
        throw error;
      }

      // 중복 지원 확인
      const applyHistory = await getConnection('wanted_pre_dev')
      .getRepository(JobApplyHistory)
      .findOne({ 
        jobOpeningId: bodyData.jobOpeningId,
        userId: currentUser.id
      });

      if (applyHistory) {
        const error = new Error('duplicate applicant');
        error.name = 'dev';
        throw error;
      }

      // 지원 프로세스
      const [jobApplyId] = await getManager('wanted_pre_dev').query(`
      SELECT insert_job_apply_history(?, ?) AS _id
      `, [
        bodyData.jobOpeningId,
        currentUser.id
      ]);

      // validation
      if (jobApplyId._id.indexOf('JA') < -1) {
        const error = new Error(`apply job failed`);
        error.name = 'dev';
        throw error;
      }

      return jobApplyId._id;
    } catch (e) {
      throw e;
    }
  }
}
