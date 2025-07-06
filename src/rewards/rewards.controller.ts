import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RewardsService } from './rewards.service';
import { RedeemRewardDto } from './dto/redeem-reward.dto';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@ApiTags('rewards')
@Controller('rewards')
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get('points')
  @ApiOperation({ summary: 'Get user reward points' })
  @ApiResponse({ status: 200, description: 'User points retrieved successfully' })
  async getUserPoints(@Query('userId') userId: string) {
    const points = await this.rewardsService.getUserPoints(userId);
    return { userId, totalPoints: points };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get user transactions with pagination' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  async getTransactions(@Query() dto: GetTransactionsDto) {
    return this.rewardsService.getTransactions(dto);
  }

  @Post('redeem')
  @ApiOperation({ summary: 'Redeem reward points' })
  @ApiResponse({ status: 200, description: 'Reward redeemed successfully' })
  async redeemReward(@Body() dto: RedeemRewardDto) {
    return this.rewardsService.redeemReward(dto);
  }

  @Get('options')
  @ApiOperation({ summary: 'Get available reward options' })
  @ApiResponse({ status: 200, description: 'Reward options retrieved successfully' })
  async getRewardOptions() {
    return this.rewardsService.getRewardOptions();
  }

  @Post('transaction')
  @ApiOperation({ summary: 'Add a new transaction (for testing)' })
  @ApiResponse({ status: 201, description: 'Transaction added successfully' })
  async addTransaction(@Body() body: { userId: string; amount: number; category: string }) {
    return this.rewardsService.addTransaction(body.userId, body.amount, body.category);
  }
}