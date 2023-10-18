import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { JobApplyHistory } from "./JobApplyHistory";
import { Company } from "./Company";

@Index("FK_job_opening_company_company_id", ["companyId"], {})
@Entity("job_opening", { schema: "wanted_pre_dev" })
export class JobOpening {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "company_id", length: 12 })
  companyId: string;

  @Column("varchar", { name: "position", nullable: true, length: 50 })
  position: string | null;

  @Column("int", {
    name: "reward",
    default: () => '0',
  })
  reward: number;

  @Column("longtext", { name: "detail", nullable: true })
  detail: string | null;

  @Column("varchar", { name: "skill", nullable: true, length: 50 })
  skill: string | null;

  @Column("datetime", {
    name: "created_dt",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdDt: Date;

  @Column("datetime", {
    name: "updated_dt",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedDt: Date;

  @OneToMany(
    () => JobApplyHistory,
    (jobApplyHistory) => jobApplyHistory.jobOpening
  )
  jobApplyHistories: JobApplyHistory[];

  @ManyToOne(() => Company, (company) => company.jobOpenings, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "company_id", referencedColumnName: "id" }])
  company: Company;
}
