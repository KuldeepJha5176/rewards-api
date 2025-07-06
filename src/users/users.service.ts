import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import  { User, UserDocument } from "./schemas/user.schema";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService implements OnModuleInit {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  private async seedUsers(): Promise<void> {
    try {
      const existingUsers = await this.userModel.countDocuments();
      if (existingUsers === 0) {
        const mockUsers = [
          {
            name: "John Doe",
            email: "john.doe@example.com",
          },
          {
            name: "Jane Smith",
            email: "jane.smith@example.com",
          },
          {
            name: "Bob Johnson",
            email: "bob.johnson@example.com",
          },
          {
            name: "Alice Brown",
            email: "alice.brown@example.com",
          },
          {
            name: "Charlie Wilson",
            email: "charlie.wilson@example.com",
          },
        ];
        await this.userModel.insertMany(mockUsers);
        this.logger.log("Mock users seeded successfully");
      }
    } catch (error) {
      this.logger.error("Error seeding users:", error);
    }
  }
}
