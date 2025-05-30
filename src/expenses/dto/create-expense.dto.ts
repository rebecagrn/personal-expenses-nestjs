import { IsString, IsNumber, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Title of the expense' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Amount of the expense' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ description: 'Category of the expense' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'Date of the expense' })
  @IsDateString()
  @IsNotEmpty()
  date: string;
}
