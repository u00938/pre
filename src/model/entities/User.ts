import { Column, Entity, Index, OneToMany } from "typeorm";
import { JobApplyHistory } from "./JobApplyHistory";

@Index("user_name_UNIQUE", ["nickname"], { unique: true })
@Entity("user", { schema: "wanted_pre_dev" })
export class User {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "uid", comment: "식별자", length: 50 })
  uid: string;

  @Column("varchar", { name: "nickname", unique: true, length: 20 })
  nickname: string;

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

  @OneToMany(() => JobApplyHistory, (jobApplyHistory) => jobApplyHistory.user)
  jobApplyHistories: JobApplyHistory[];
}
