import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'generated/prisma';

const userSelectFields = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  role: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: userSelectFields,
    });
    return users;
  }

  async findOne(id: number) {
    return await this.findUserOrThrow(id);
  }

  async update(id: number, data: UpdateUserDto) {
    await this.findUserOrThrow(id);
    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelectFields,
    });
  }

  async remove(id: number) {
    await this.findUserOrThrow(id);
    return this.prisma.user.delete({ where: { id }, select: userSelectFields });
  }

  async findUserOrThrow(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });
    if (!user) {
      throw new NotFoundException(`User wih ID ${id} not found`);
    }
    return user;
  }
}
