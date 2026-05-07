import { DataSource } from "typeorm";
import { config } from "dotenv";
config({path: `.env.${process.env.NODE_ENV}`, quiet: false})

let db_config = {
    type: 'mysql',
    synchronize: false,
    migrations: [__dirname + './migrations/*{js,ts}'],
    cli: {
        migrationDir: './migrations'
    }
}

switch (process.env.NODE_ENV){
    case 'development':
        db_config = Object.assign(db_config, {
            type: process.env.DB_TYPE,
            database: process.env.DB_NAME,
            username: process.env.USER_NAME,
            password: process.env.PASSWORD,
            entities: [__dirname + '/**/*.entity.{ts, js}']
        });
        break;
    
    default:
        console.error(`Unknown environmet ${process.env.NODE_ENV}`);
}

export const db_connection = new DataSource(db_config as DataSource["options"]);