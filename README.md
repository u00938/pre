# wanted-pre-onboarding-backend

> 원티드 프리온보딩 인턴십 10월 사전과제


### Tech Stack
- Node.js
- (Javascript)
- Typescript
- Mysql
- Typeorm


### Backend
```console
$ npm install
$ npm run start
```


### env file (.dev.env)
```
DATABASE_NAME=
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
TYPEORM_ENTITIES = ./src/model/entities/*.ts
```

<br>

## 구현 기능 및 사용법

### GET: /api/job-opening/list 
>채용공고 목록 조회

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}
```

result example
```json
[
  {
    "jobOpeningId": "JO2310180001",
    "companyName": "원티드랩",
    "countryName": "한국",
    "regionName": "서울",
    "position": "백엔드 주니어 개발자",
    "reward": 90000,
    "skill": "Python"
  },
  {
    "jobOpeningId": "JO2310180002",
    "companyName": "네이버",
    "countryName": "한국",
    "regionName": "판교",
    "position": "Django 백엔드 개발자",
    "reward": 1000000,
    "skill": "Django"
  }
]
```

<br>

### POST: /api/job-opening
> 채용공고 등록

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}

// body
{
  "companyId": "CP2310170001",
  "position": "백엔드 주니어 개발자3",
  "reward": 1000000,
  "detail": "원티드랩에서 백엔드 시니어 개발자를 채용합니다. 자격요건은..",
  "skill": "Django"
}
```

result example
```json
"JO2310180001"
```

<br>

### PUT: /api/job-opening
> 채용공고 수정

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}

// body
{
  "jobOpeningId": "JO2310180001",
  "companyId": "CP2310170001",
  "position": "백엔드 주니어 개발자",
  "reward": 90000,
  "detail": "원티드랩에서 백엔드 주니어 개발자를 채용합니다. 자격요건은..",
  "skill": "Python"
}
```

result example
```json
true
```

<br>

### DELETE: /api/job-opening
> 채용공고 삭제

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}

// body
{
  "jobOpeningId": "JO2310180005"
}
```

result example
```json
true
```

<br>

### GET: /api/job-opening/detail?id
> 채용공고 상세 페이지 조회

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}

// query
{
  "id": "JO2310180005"
}
```

result example
```json
{
  "jobOpeningId": "JO2310180001",
  "companyName": "원티드랩",
  "countryName": "한국",
  "regionName": "서울",
  "position": "백엔드 주니어 개발자",
  "reward": 90000,
  "skill": "Python",
  "detail": "원티드랩에서 백엔드 주니어 개발자를 채용합니다. 자격요건은..",
  "otherIdsList": [
    "JO2310180001",
    "JO2310180006",
    "JO2310180007"
  ]
}
```

<br>

### GET: /api/job-opening?search
> 채용공고 검색

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}

// query
{
  "search": "원티드"
}
```

result example
```json
[
  {
    "jobOpeningId": "JO2310180004",
    "companyName": "네이버",
    "countryName": "한국",
    "regionName": "판교",
    "position": "Django 백엔드 개발자",
    "reward": 1000000,
    "skill": "Django"
  },
  {
    "jobOpeningId": "JO2310180006",
    "companyName": "원티드랩",
    "countryName": "한국",
    "regionName": "서울",
    "position": "백엔드 주니어 개발자",
    "reward": 1000000,
    "skill": "Django"
  }
]
```

<br>

### POST: /api/job-apply
> (사용자) 채용공고 지원

request
```json
// header
{
  "Content-Type": "application/json",
  "Authorization": "Bearer test"
}

// query
{
  "search": "원티드"
}
```

result example
```json
"JA2310180003"
```

<br>

## DB routines

- pk 생성 function
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `fn_get_seq_12`(seq_name VARCHAR(2)) RETURNS varchar(12) CHARSET utf8mb4
BEGIN
    DECLARE seq_id VARCHAR(12);

    INSERT INTO id_sequence (id, no)
    VALUES (seq_name, LAST_INSERT_ID(1))
    ON DUPLICATE KEY UPDATE no = IF(LAST_INSERT_ID(no + 1) = 10000, LAST_INSERT_ID(1), LAST_INSERT_ID(no + 1));

    SET seq_id =
            (SELECT CONCAT(seq_name, CONCAT(DATE_FORMAT(NOW(), '%y%m%d'), LPAD(LAST_INSERT_ID(), 4, '0'))));

    RETURN seq_id;
END
```

<br>

- 채용공고 등록 function
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `insert_job_opening`(company_id_val VARCHAR(12), position_val VARCHAR(50), 
									reward_val INT, detail_val LONGTEXT, skill_val VARCHAR(50)) RETURNS varchar(12) CHARSET utf8mb4
BEGIN
    DECLARE seq_id VARCHAR(12);

    SET seq_id = fn_get_seq_12('JO');

    INSERT INTO job_opening (id, company_id, position, reward, detail, skill)
    VALUES (seq_id, company_id_val, position_val, reward_val, detail_val, skill_val);

    RETURN seq_id;
END
```

<br>

- 채용공고 지원 function
```sql
CREATE DEFINER=`root`@`localhost` FUNCTION `insert_job_apply_history`(job_opening_id_val VARCHAR(12), user_id_val VARCHAR(12)) RETURNS varchar(12) CHARSET utf8mb4
BEGIN
    DECLARE seq_id VARCHAR(12);

    SET seq_id = fn_get_seq_12('JA');

    INSERT INTO job_apply_history (id, job_opening_id, user_id)
    VALUES (seq_id, job_opening_id_val, user_id_val);

    RETURN seq_id;
END
```


