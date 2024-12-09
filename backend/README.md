# Backend Quest

## Software Requirement

-   Node.js v. 20.x.x (LTS)

ในแต่ละ Section สามารถใช้คำสั่ง `npm run test` เพื่อรัน Integration Test/Unit Test สำหรับตรวจสอบว่าได้ทำถูกต้องแล้วได้

**สามารถติดตั้ง Libary อิ่นๆเพิ่มเข้ามาได้**

ให้ Implement REST API สองเส้นสำหรับเรียกดูข้อมูลภายในฐานข้อมูลที่มี
Schema ต่อไปนี้

```prisma
model patient {
    hospitalNumber String @id
    firstName      String
    lastName       String

    birthday DateTime

    sex       String // male / female / unspecified
    encounter encounter[]
}

model encounter {
    transactionNumber   String   @id
    visitDate           DateTime
    physicalExamination String
    diagnosis           String
    presentIllness      String

    patient               patient @relation(fields: [patientHospitalNumber], references: [hospitalNumber])
    patientHospitalNumber String
}
```

โดยมี Route และ Method ทั้งหมดดังนี้

### Patients

-   [GET] /patients
    -   สำหรับเรียกดูข้อมูลผู้ป่วยทั้งหมด โดยคืน Status **200**

ตัวอย่างข้อมูล

```json
[
    {
        "hospitalNumber": "0000001",
        "firstName": "John",
        "lastName": "Doe",
        "birthday": "1990-01-01T00:00:00.000Z",
        "sex": "male"
    },
    {
        "hospitalNumber": "0000002",
        "firstName": "Jane",
        "lastName": "Doe",
        "birthday": "1990-01-01T00:00:00.000Z",
        "sex": "female"
    }
]
```

-   [GET] /patients/:hospitalNumber (ex. /patients/0000001)
    -   สำหรับเรียกดูข้อมูลผู้ป่วยโดยใช้เรียกประจำตัวผู้ป่วย (Hospital Number, HN)

โดยถ้ามี HN นั้นภายในระบบให้คืน Status เป็น **200** แต่หากไม่มี HN ภายในระบบให้คืน Status **404** (Not Found)

ตัวอย่างข้อมูล

```json
{
    "hospitalNumber": "0000001",
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1990-01-01T00:00:00.000Z",
    "sex": "male"
}
```

-   [POST] /patients
    -   สำหรับบันทึกข้อมูลผู้ป่วยรายใหม่

หากสามารถสร้างได้สำเร็จให้คืน Status **201** หากมีปัญหาไดๆในการสร้างให้คืน Status **500** (Internal Error) ออกมา

ตัวอย่าง Body ของ Request

```json
{
    "hospitalNumber": "0000003",
    "firstName": "Sarah",
    "lastName": "Noah",
    "birthday": "1990-01-01T00:00:00.000Z",
    "sex": "female"
}
```

-   [PUT] /patients/:hospitalNumber - สำหรับแก้ไขผู้ป่วยตาม HN ที่ระบุ

หากสามารถ Update สำเร็จให้คืนค่า 204 แต่หากหาก หาผู้ป่วยไม่พบให้คืน **404** และหากมีปัญหาสำหรับการ Update ให้คืน **500**

ตัวอย่าง Body ของ Request "**/patients/0000001**"

```json
{
    "hospitalNumber": "0000001",
    "firstName": "John",
    "lastName": "Doe",
    "birthday": "1990-01-01T00:00:00.000Z",
    "sex": "male"
}
```

-   [*] /patient
    -   ให้ สั่งกลับเป็น status **405** Method Not Allowed

### Encounter

-   [GET] /encounters
    -   สำหรับดึงข้อมูล visit ทั้งหมดของผู้ป่วยใช้บริการ

```json
[
    {
        "transactionNumber": "0000002",
        "visitDate": "2024-02-24T00:00:00.000Z",
        "physicalExamination": "normal",
        "diagnosis": "normal",
        "presentIllness": "normal",
        "patientHospitalNumber": "0000001"
    },
    {
        "transactionNumber": "0000001",
        "visitDate": "2024-02-24T00:00:00.000Z",
        "physicalExamination": "abnormal",
        "diagnosis": "fever",
        "presentIllness": "feeling unwell",
        "patientHospitalNumber": "0000002"
    }
]
```

-   [GET] /encounters/:transactionNumber (ex: /encounters/0000002) - สำหรับดังข้อมูล visit โดยใช้ Transaction Number

โดยถ้ามี Transaction Number นั้นภายในระบบให้คืน Status เป็น **200** แต่หากไม่มี Transaction Number ภายในระบบให้คืน Status **404** (Not Found)

```json
{
    "transactionNumber": "0000002",
    "visitDate": "2024-02-24T00:00:00.000Z",
    "physicalExamination": "normal",
    "diagnosis": "normal",
    "presentIllness": "normal",
    "patientHospitalNumber": "0000001",
    "patient": {
        "hospitalNumber": "0000001",
        "firstName": "John",
        "lastName": "Doe"
    }
}
```

-   [POST] /encounters
    -   สำหรับสร้างรายการเข้าใช้บริการ

หากสามารถสร้างได้สำเร็จให้คืน Status **201** หากมีปัญหาไดๆในการสร้างให้คืน Status **500** (Internal Error) ออกมา

ตัวอย่าง Body ของ Request

```json
{
    "transactionNumber": "0000003",
    "visitDate": "2024-02-24T00:00:00.000Z",
    "physicalExamination": "normal",
    "diagnosis": "normal",
    "presentIllness": "normal",
    "patientHospitalNumber": "0000001"
}
```

-   [PUT] /encounters/:transactionNumber (ex: /encounters/0000002)

หากสามารถ Update สำเร็จให้คืนค่า 204 แต่หากหาก หา Visit ไม่พบให้คืน **404** และหากมีปัญหาสำหรับการ Update ให้คืน **500**

ตัวอย่าง Body ของ Request "**/encounters/0000002**"

```json
{
    "transactionNumber": "0000002",
    "visitDate": "2024-02-24T00:00:00.000Z",
    "physicalExamination": "normal",
    "diagnosis": "normal",
    "presentIllness": "normal",
    "patientHospitalNumber": "0000001"
}
```

-   [*] /encounters
    -   ให้ สั่งกลับเป็น status **405** Method Not Allowed
