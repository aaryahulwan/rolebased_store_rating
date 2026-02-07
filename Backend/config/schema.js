import { mysqlTable, int, text, varchar } from 'drizzle-orm/mysql-core';

export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('user'), 
});

export const stores = mysqlTable('stores', {
  id: int('id').autoincrement().primaryKey(),
  name: text('name').notNull(),
  address: text('address'),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').default('store'),
});

export const ratings = mysqlTable('ratings', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('user_id').references(() => users.id),
  storeId: int('store_id').references(() => stores.id),
  rating: int('rating').notNull(), // 1-5
});
