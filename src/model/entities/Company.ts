import { Column, Entity, OneToMany } from "typeorm";
import { JobOpening } from "./JobOpening";

@Entity("company", { schema: "wanted_pre_dev" })
export class Company {
  @Column("varchar", { primary: true, name: "id", length: 12 })
  id: string;

  @Column("varchar", { name: "company_name", length: 20 })
  companyName: string;

  @Column("varchar", { name: "country_name", nullable: true, length: 20 })
  countryName: string | null;

  @Column("varchar", { name: "region_name", nullable: true, length: 20 })
  regionName: string | null;

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

  @OneToMany(() => JobOpening, (jobOpening) => jobOpening.company)
  jobOpenings: JobOpening[];
}
