import {
  BelongsTo,
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { ClientModel } from '../../client-adm/repository/client.model';
import { ProductStoreCatalogModel } from '../../store-catalog/repository/product.model';

@Table({
  tableName: 'orders',
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @BelongsTo(() => ClientModel, {
    foreignKey: 'clientId',
    targetKey: 'id',
    as: 'client',
  })
  declare client: ClientModel;

  @HasMany(() => ProductStoreCatalogModel, 'orderId')
  declare products: ProductStoreCatalogModel[];

  @Column({ allowNull: false })
  declare status: string;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
