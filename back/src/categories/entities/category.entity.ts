import { Products } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'CATEGORIES',
})
export class Categories {
  @PrimaryGeneratedColumn('uuid') // la diferencia entre primaryGeneratedColumn y primaryColumn es que el primero genera automaticamente un valor unico para la columna, mientras que el segundo no lo hace.
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true,
  })
  name: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
}
