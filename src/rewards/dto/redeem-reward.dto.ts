import { IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RedeemRewardDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId!: string;

  @ApiProperty({ description: 'Points to redeem', minimum: 1 })
  @IsNumber()
  @Min(1)
  pointsToRedeem!: number;

  @ApiProperty({ description: 'Type of reward to redeem' })
  @IsString()
  rewardType!: string;
}
