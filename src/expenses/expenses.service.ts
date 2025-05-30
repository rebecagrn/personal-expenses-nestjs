import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Cache } from 'cache-manager';

@Injectable()
export class ExpensesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        date: new Date(createExpenseDto.date),
      },
    });
  }

  async findAll(month?: number, year?: number, category?: string) {
    const cacheKey = `expenses:${month || 'all'}:${year || 'all'}:${
      category || 'all'
    }`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      return cached;
    }

    const where: any = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }
    if (category) {
      where.category = category;
    }

    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
    await this.cacheManager.set(cacheKey, expenses, 60); // cache for 60 seconds
    return expenses;
  }

  async findOne(id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    try {
      return await this.prisma.expense.update({
        where: { id },
        data: {
          ...updateExpenseDto,
          date: updateExpenseDto.date
            ? new Date(updateExpenseDto.date)
            : undefined,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.expense.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }
  }
}
