import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ExpensesModule } from './expenses/expenses.module';
import { PrismaService } from './prisma/prisma.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
    ExpensesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
