module.exports = {
  DELETE_SCHEMA: 'DROP SCHEMA "public" CASCADE',
  CREATE_SCHEMA: 'CREATE SCHEMA "public"',
  CLEAR_DATABASE: `
     do
     $$
      declare
        l_stmt text;
      begin 
        select 'truncate ' || string_agg(format('%I.%I', schemaname, tablename), ',')
        into l_stmt 
        from pg_tables
        where schemaname in ('public') and 
        tablename not in ('knex_migrations', 'knex_migrations_lock', 'role');
        execute l_stmt;
      end;
      $$
  `,
  ROLES_EXISTS: `
    SELECT 
      count(*) AS count 
    FROM 
      "public"."role";
  `,
  INSERT_ROLES: `
    INSERT INTO
      "public"."role"(name) 
    VALUES ('administrator'), ('user');`,
  INSERT_ADMINISTRATOR: `
    WITH inserted_admin AS (
      INSERT INTO "public"."user" (email, first_name, last_name) VALUES ('administrator@test.com', 'Test', 'Administrator') RETURNING id
    ), inserted_admin_roles AS (
       INSERT INTO "public"."users_roles" (user_id, role_id)
           SELECT (SELECT id FROM inserted_admin), (SELECT id FROM "public"."role" WHERE name = 'administrator')
    )
    INSERT INTO "public"."security" 
    SELECT
     id,
     '9c46dbec5d03f74352cc4a4da354b4e9796887eeb66ac292617692e765dbe400352559b16229f97b27614b51dbfbbb14613f2c10350435a8feaf53f73ba01c7c',
     '9c46dbec5d03f74352cc4a4da354b4e9796887eeb66ac292617692e765dbe400352559b16229f97b27614b51dbfbbb14613f2c10350435a8feaf53f73ba01c7a',
      null,
      true,
      false,
      NOW() 
    FROM inserted_admin;`,
  INSERT_USER: `
    WITH inserted_user AS (
      INSERT INTO "public"."user" (email, first_name, last_name) VALUES ('user@test.com', 'Test', 'User') RETURNING id
    ), inserted_admin_roles AS (
       INSERT INTO "public"."users_roles" (user_id, role_id)
           SELECT (SELECT id FROM inserted_user), (SELECT id FROM "public"."role" WHERE name = 'user')
    )
    INSERT INTO "public"."security" 
    SELECT
     id,
     '9c46dbec5d03f74352cc4a4da354b4e9796887eeb66ac292617692e765dbe400352559b16229f97b27614b51dbfbbb14613f2c10350435a8feaf53f73ba01c7c',
     '9c46dbec5d03f74352cc4a4da354b4e9796887eeb66ac292617692e765dbe400352559b16229f97b27614b51dbfbbb14613f2c10350435a8feaf53f73ba01c7b',
      null,
      true,
      false,
      NOW() 
    FROM inserted_user;`,
  INSERT_GROWTH_BONDS: `
       INSERT INTO 
        "public"."growth_bond" (name, duration, monthly_growth, annual_growth, total_growth) 
      VALUES 
        ('FOMO', 18, 0.55, 6.67, 1.1),
        ('HODL',36, 0.58, 7, 1.21),
        ('LAMBO',60, 0.67, 8, 1.4),
        ('MOON',120, 0.83, 10, 2);
        `
};