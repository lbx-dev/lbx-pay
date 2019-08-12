exports.up = function(knex) {
  const sql = `                        
    CREATE TABLE
      "public"."growth_bond" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(5) COLLATE "pg_catalog"."default" NOT NULL,
        "duration" integer NOT NULL,
        "monthly_growth" numeric NOT NULL,
        "annual_growth" numeric NOT NULL,
        "total_growth" numeric NOT NULL,
        PRIMARY KEY ("id")
      );
    `;
  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS "public"."growth_bond" CASCADE;
  `;
  return knex.raw(sql);
};
