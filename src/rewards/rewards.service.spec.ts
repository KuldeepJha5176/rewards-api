import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardsService } from './rewards.service';
import { Reward } from './schemas/reward.schema';
import { Transaction } from './schemas/transaction.schema';
import { Redemption } from './schemas/redemption.schema';
import { UsersService } from '../users/users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RewardsService', () => {
  let service: RewardsService;
  let rewardModel: Model<Reward>;
  let transactionModel: Model<Transaction>;
  let redemptionModel: Model<Redemption>;
  let usersService: UsersService;

  const mockUser = { _id: 'user123', name: 'Test User', email: 'test@example.com' };
  const mockReward = { userId: 'user123', totalPoints: 1000, updatedAt: new Date() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RewardsService,
        {
          provide: getModelToken(Reward.name),
          useValue: {
            findOne: jest.fn(),
            findOneAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(Transaction.name),
          useValue: {
            find: jest.fn(),
            countDocuments: jest.fn(),
          },
        },
        {
          provide: getModelToken(Redemption.name),
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RewardsService>(RewardsService);
    rewardModel = module.get<Model<Reward>>(getModelToken(Reward.name));
    transactionModel = module.get<Model<Transaction>>(getModelToken(Transaction.name));
    redemptionModel = module.get<Model<Redemption>>(getModelToken(Redemption.name));
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUserPoints', () => {
    it('should return user points', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(rewardModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockReward),
      } as any);

      const result = await service.getUserPoints('user123');
      expect(result).toBe(1000);
    });

    it('should return 0 if user has no rewards', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(rewardModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await service.getUserPoints('user123');
      expect(result).toBe(0);
    });

    it('should throw NotFoundException for invalid user', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      await expect(service.getUserPoints('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('redeemReward', () => {
    it('should throw BadRequestException for insufficient points', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);
      jest.spyOn(rewardModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue({ totalPoints: 500 }),
      } as any);

      const dto = {
        userId: 'user123',
        pointsToRedeem: 1000,
        rewardType: 'cashback',
      };

      await expect(service.redeemReward(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid reward type', async () => {
      jest.spyOn(usersService, 'findById').mockResolvedValue(mockUser as any);

      const dto = {
        userId: 'user123',
        pointsToRedeem: 1000,
        rewardType: 'invalid-reward',
      };

      await expect(service.redeemReward(dto)).rejects.toThrow(BadRequestException);
    });
  });
});
