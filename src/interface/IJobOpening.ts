export interface IJobOpeningList {
  jobOpeningId: string,
  companyName: string,
  contryName: string,
  regionName: string,
  reward: number,
  skill: string
}

export interface IJobOpeningDetail extends IJobOpeningList {
  detail: string,
  otherIdsList: Array<string>
}

