import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  customerPhone: string;

  // The shipping address where the perfume package will be delivered
  @Column()
  shippingAddress: string;

  // Storing the order status, defaulting to pending
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  // Storing order items as a JSON array directly in one column
  // Example: [{ productId: "uuid", name: "Sauvage", price: 95.0, quantity: 2 }]
  @Column({ type: 'json' })
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>;

  // Many-to-One relationship with User. Set to nullable: true so guests can checkout.
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL', eager: true })
  user: User | null;

  @CreateDateColumn()
  createdAt: Date;
}
