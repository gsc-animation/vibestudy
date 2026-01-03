# Task 2.1: Domain Modeling & Database Schemas

## Status
- [x] Create `backend/src/database/schemas/user.schema.ts`
- [x] Create `backend/src/database/schemas/quest.schema.ts`
- [x] Create `backend/src/database/dtos/create-user.dto.ts`
- [x] Create `backend/src/database/dtos/create-quest.dto.ts`
- [x] Create `backend/src/database/database.module.ts`
- [x] Integrate `DatabaseModule` into `backend/src/app.module.ts`

## Changes
- Defined `User` Mongoose schema with fields: `name`, `email`, `password_hash`, `role`.
- Defined `Quest` Mongoose schema with fields: `title`, `description`, `status`, `difficulty`, `subject_tag`, `sprint_week`.
- Created Zod DTOs `CreateUserDto` and `CreateQuestDto` for validation.
- Implemented `DatabaseModule` to register Mongoose schemas.
- Imported `DatabaseModule` in `AppModule`.

## Key Decisions
- Used `nestjs-zod` for DTOs to leverage Zod's validation capabilities and integration with NestJS.
- Enabled explicit definite assignment assertions (`!`) in Mongoose schemas to resolve TypeScript initialization errors.
- Enums were used for `User.role` and `Quest.status` to ensure data integrity.

## Next Steps
- Proceed to Task 2.2: Authentication System (NextAuth).