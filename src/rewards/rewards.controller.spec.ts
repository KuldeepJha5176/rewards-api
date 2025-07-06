import { Test, TestingModule } from '@nestjs/testing';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';

describe('RewardsController', () => {
  let controller: RewardsController;
  let service: RewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RewardsController],
      providers: [
        {
          provide: RewardsService,
          useValue: {
            getUserPoints: jest.fn(),
            getTransactions: jest.fn(),
            redeemReward: jest.fn(),
            getRewardOptions: jest.fn(),
            addTransaction: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RewardsController>(RewardsController);
    service = module.get<RewardsService>(RewardsService);
  });

  describe('getUserPoints', () => {
    it('should return user points', async () => {
      const mockPoints = 1000;
      jest.spyOn(service, 'getUserPoints').mockResolvedValue(mockPoints);

      const result = await controller.getUserPoints('user123');
      expect(result).toEqual({ userId: 'user123', totalPoints: mockPoints });
    });
  });

  describe('getRewardOptions', () => {
    it('should return reward options', async () => {
      const mockOptions = [
        { id: '1', name: 'Cashback $10', pointsRequired: 1000, description: 'Test', category: 'cashback' }
      ];
      jest.spyOn(service, 'getRewardOptions').mockResolvedValue(mockOptions);

      const result = await controller.getRewardOptions();
      expect(result).toEqual(mockOptions);
    });
  });
});