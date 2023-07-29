import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { InvoiceModel } from './invoice.model';

@Table({
  tableName: 'products',
  timestamps: false,
})
export class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  declare invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  declare invoice: InvoiceModel;

  @Column({ allowNull: false })
  declare createdAt: Date;

  @Column({ allowNull: false })
  declare updatedAt: Date;
}
