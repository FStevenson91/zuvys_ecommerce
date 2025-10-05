// este es un snippet de codigo que configura cloudinary en un proyecto de nestjs, utilizando variables de entorno para almacenar las credenciales de acceso. Este fragmento de codigo lo podemos obtener de la documentacion oficial de cloudinary.
import { v2 as cloudinary } from 'cloudinary';

// custom provider = {provide: 'CLOUDINARY', useValue/ useFactory(function)/ useClass ()=> cloudinary}
export const cloudinaryConfig = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  },
};
