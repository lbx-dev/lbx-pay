exports.up = function(knex) {
  const sql = `                        
    CREATE TABLE
      "public"."deposit" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
        "bond_id" UUID,
        "user_id" UUID,
        "amount" VARCHAR(13),
        "transaction_id" VARCHAR(64),
        PRIMARY KEY ("id"),
        CONSTRAINT "d_bond_fk" FOREIGN KEY ("bond_id") REFERENCES "public"."growth_bond" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
        CONSTRAINT "d_user_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `;
  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS "public"."deposit" CASCADE;
  `;
  return knex.raw(sql);
};
