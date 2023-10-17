import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { JobOpening } from "./JobOpening";
import { User } from "./User";

@Index("FK_job_apply_history_user_id", ["userId"], {})
@Index("job_opening_id", ["jobOpeningId", "userId"], { unique: true })
@Entity("job_apply_history", { schema: "wanted_pre_dev" })
export class JobApplyHistory {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "job_opening_id", length: 12 })
  jobOpeningId: string;

  @Column("varchar", { name: "user_id", length: 12 })
  userId: string;

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

  @ManyToOne(() => JobOpening, (jobOpening) => jobOpening.jobApplyHistories, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "job_opening_id", referencedColumnName: "id" }])
  jobOpening: JobOpening;

  @ManyToOne(() => User, (user) => user.jobApplyHistories, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "id" }])
  user: User;
}
