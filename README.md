# Rewards API

A comprehensive NestJS-based rewards management system with MongoDB integration, featuring real-time updates via WebSockets and comprehensive analytics.

## Features

### Core Features
- **User Management**: Mock user system with seeded data
- **Rewards Management**: Point tracking, transactions, and redemptions
- **Real-time Updates**: WebSocket integration for live point updates
- **Analytics**: Reward distribution analysis
- **Comprehensive Testing**: Unit tests with Jest
- **API Documentation**: Swagger/OpenAPI documentation

### API Endpoints

#### Rewards Management
- `GET /rewards/points?userId={id}` - Get user's total reward points
- `GET /rewards/transactions?userId={id}&page={page}&limit={limit}` - Get paginated transaction history
- `POST /rewards/redeem` - Redeem points for rewards
- `GET /rewards/options` - Get available reward options
- `POST /rewards/transaction` - Add new transaction (for testing)

#### Analytics
- `GET /analytics/rewards-distribution` - Get rewards distribution by category

### Database Schema

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  createdAt: Date
}
```

#### Rewards Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  totalPoints: Number,
  updatedAt: Date
}
```

#### Transactions Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  amount: Number,
  category: String,
  pointsEarned: Number,
  timestamp: Date
}
```

#### Redemptions Collection
```javascript
{
  _id: ObjectId,
  userId: String,
  pointsRedeemed: Number,
  rewardType: String,
  timestamp: Date
}
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd rewards-api
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your database configurations
```

3. **Database Setup**
```bash
# Start MongoDB (if not using Docker)
mongod

# Or use Docker Compose
docker-compose up -d mongodb
```

4. **Run the Application**
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

## Testing

### Unit Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

### API Testing

The API includes comprehensive Swagger documentation available at:
- **Swagger UI**: `http://localhost:3000/api`

### Sample API Calls

#### Get User Points
```bash
curl -X GET "http://localhost:3000/rewards/points?userId=USER_ID"
```

#### Get Transactions
```bash
curl -X GET "http://localhost:3000/rewards/transactions?userId=USER_ID&page=1&limit=5"
```

#### Redeem Reward
```bash
curl -X POST "http://localhost:3000/rewards/redeem" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "pointsToRedeem": 1000,
    "rewardType": "cashback"
  }'
```

#### Add Transaction (Testing)
```bash
curl -X POST "http://localhost:3000/rewards/transaction" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "amount": 100,
    "category": "shopping"
  }'
```

## WebSocket Integration

### Connect to WebSocket
```javascript
const socket = io('http://localhost:3000');

// Join user room for real-time updates
socket.emit('joinUserRoom', { userId: 'USER_ID' });

// Listen for point updates
socket.on('pointsUpdated', (data) => {
  console.log('Points updated:', data.points);
});

// Listen for new transactions
socket.on('newTransaction', (transaction) => {
  console.log('New transaction:', transaction);
});

// Listen for redemptions
socket.on('redemption', (redemption) => {
  console.log('Redemption completed:', redemption);
});
```

## Available Reward Options

The system includes predefined reward options:

1. **Cashback $10** - 1000 points
2. **Cashback $25** - 2500 points
3. **Amazon Voucher $20** - 2000 points
4. **Starbucks Voucher $15** - 1500 points

## Error Handling

The API implements comprehensive error handling:

- **400 Bad Request**: Invalid input data or insufficient points
- **404 Not Found**: User not found or invalid endpoints
- **500 Internal Server Error**: Server-side errors

### Error Response Format
```json
{
  "statusCode": 400,
  "message": "Insufficient points. Available: 500, Required: 1000",
  "error": "Bad Request"
}
```

## Data Validation

All endpoints use `class-validator` for input validation:

- Required fields validation
- Type validation (string, number, etc.)
- Range validation (minimum values)
- Custom validation rules

## Analytics Features

### Rewards Distribution
Get insights into reward point distribution across categories:

```bash
curl -X GET "http://localhost:3000/analytics/rewards-distribution"
```

**Response:**
```json
{
  "distribution": [
    {
      "_id": "shopping",
      "totalTransactions": 15,
      "totalPoints": 1500,
      "totalAmount": 15000
    }
  ],
  "summary": {
    "totalCategories": 5,
    "totalTransactions": 50,
    "totalPoints": 5000,
    "totalAmount": 50000
  }
}
```

## Performance Considerations

- **Pagination**: All list endpoints support pagination
- **Indexing**: Database indexes on frequently queried fields
- **Caching**: Redis integration ready for caching frequent queries
- **Connection Pooling**: MongoDB connection pooling for optimal performance

## Security Features

- **Input Validation**: Comprehensive validation using class-validator
- **Error Sanitization**: Sanitized error messages to prevent information leakage
- **CORS**: Configurable CORS settings
- **Rate Limiting**: Ready for rate limiting implementation

## Development Guidelines

### Code Structure
- **Modular Architecture**: Feature-based modules
- **Dependency Injection**: NestJS DI container
- **Separation of Concerns**: Controllers, Services, DTOs, Schemas
- **Type Safety**: Full TypeScript integration

### Testing Strategy
- **Unit Tests**: Service and controller testing
- **Integration Tests**: End-to-end API testing
- **Mocking**: Comprehensive mocking for external dependencies
- **Coverage**: High test coverage requirements

## Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] Security headers configured
- [ ] Logging configured
- [ ] Health checks implemented
- [ ] Monitoring setup

### Scaling Considerations
- **Database**: MongoDB sharding for large datasets
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Multiple application instances
- **WebSocket**: Socket.io clustering for multiple instances

## Contributing

1. Fork the repository
2. Create feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit pull request

## License

This project is licensed under the MIT License.