import type { Knex } from "knex";
import { ENVS } from "@/utils";

// Configuração de conexão com o MySQL
const config: { [key: string]: Knex.Config } = {
  production: {
    client: "mysql2",
    connection: {
      host: ENVS.CONFIG.DB.HOST,
      user: ENVS.CONFIG.DB.USER,
      port: Number(ENVS.CONFIG.DB.PORT),
      password: ENVS.CONFIG.DB.PASSWORD,
      database: ENVS.CONFIG.DB.NAME,
    }
  },
};

export default config;
