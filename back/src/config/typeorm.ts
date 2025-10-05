import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env.development' });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dropSchema: false,
  synchronize: false,
  logging: true,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
// este metodo registerAs, lo que me permite es tomar un objeto de configuracion y registrarlo en forma de un provider, que luego puedo inyectar en cualquier parte de mi aplicacion, por ejemplo en app.module.ts, haciendo que se vuelva global y pueda ser accedido desde cualquier modulo.
// recibe dos parametros, el primero es el nombre con el que quiero registrar mi configuracion, en este caso 'typeorm', y el segundo es una funcion que retorna el objeto de configuracion.

export const connectionSource = new DataSource(config as DataSourceOptions); // esto es necesario para que las herramientas de linea de comando de typeorm puedan conectarse a la base de datos y ejecutar las migraciones, ya que estas herramientas no tienen acceso al contenedor de inyeccion de dependencias de nestjs, por lo que no pueden obtener la configuracion desde alli. Por eso debemos exportar una instancia de DataSource, que es la clase que typeorm utiliza para conectarse a la base de datos, y pasarle la misma configuracion que usamos en el registerAs.
