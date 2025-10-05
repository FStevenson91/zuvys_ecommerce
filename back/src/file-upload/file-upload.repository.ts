import { Injectable } from '@nestjs/common';
import * as toStream from 'buffer-to-stream';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileUploadRepository {
  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
            reject(error);
          } else {
            resolve(result!);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
// se crea un repositorio para manejar la logica de cloudinary, ya que no existe un repositorio virtual de cloudinary en typeorm, por eso se crea este repositorio para manejar la logica de cloudinary, y en el servicio se inyecta ese repositorio para usarlo en el servicio de file-upload.

// se utiliza el paquete buffer-to-stream para convertir el buffer del archivo en un stream, ya que cloudinary solo acepta streams para subir archivos. El metodo uploadImage recibe un archivo de tipo Express.Multer.File, que es el tipo que utiliza multer para manejar los archivos subidos, y retorna una promesa que se resuelve con la respuesta de cloudinary, que es de tipo UploadApiResponse.
// dentro del metodo se crea una nueva promesa, y se utiliza el metodo upload_stream de cloudinary para subir el archivo, este metodo recibe un callback que se ejecuta cuando la subida termina, y en ese callback se resuelve o rechaza la promesa dependiendo si hubo un error o no. Finalmente, se convierte el buffer del archivo en un stream y se lo pasa al metodo upload_stream para que lo suba a cloudinary.
// el metodo upload_stream recibe dos parametros, el primero es un objeto con opciones para la subida, en este caso se le pasa resource_type: 'auto' para que cloudinary detecte automaticamente el tipo de archivo (imagen, video, etc), y el segundo parametro es el callback que se ejecuta cuando la subida termina.
// en el servicio file-upload.service.ts, se inyecta este repositorio y se utiliza el metodo uploadImage para subir la imagen a cloudinary, y luego se actualiza la url de la imagen en el producto correspondiente.
