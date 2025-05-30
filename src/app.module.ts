import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ExpensesModule],
  providers: [PrismaService],
})
export class AppModule {}
