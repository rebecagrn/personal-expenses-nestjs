import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(createExpenseDto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        ...createExpenseDto,
        date: new Date(createExpenseDto.date),
      },
    });
  }

  async findAll(month?: number, year?: number) {
    const where: any = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.expense.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });
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
