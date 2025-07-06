import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from '../rewards/schemas/transaction.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async getRewardsDistribution() {
    const distribution = await this.transactionModel.aggregate([
      {
        $group: {
          _id: '$category',
          totalTransactions: { $sum: 1 },
          totalPoints: { $sum: '$pointsEarned' },
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
    ]);

    return {
      distribution,
      summary: {
        totalCategories: distribution.length,
        totalTransactions: distribution.reduce((sum, cat) => sum + cat.totalTransactions, 0),
        totalPoints: distribution.reduce((sum, cat) => sum + cat.totalPoints, 0),
        totalAmount: distribution.reduce((sum, cat) => sum + cat.totalAmount, 0),
      },
    };
  }
}