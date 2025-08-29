import { CreateOrderRepository } from "../create-order";
import { faker } from "@faker-js/faker";

const mockDb = {
  insert: jest.fn(),
};

const mockOrder = {
  id: faker.string.uuid(),
  user_id: faker.string.uuid(),
  order_date: new Date(),
  status: "pending" as const,
  total: faker.number
    .float({ min: 10, max: 1000, fractionDigits: 2 })
    .toString(),
  delivery_street: faker.location.street(),
  delivery_number: faker.location.buildingNumber(),
  delivery_neighborhood: faker.location.county(),
  delivery_city: faker.location.city(),
  delivery_state: faker.location.state(),
  delivery_zip_code: faker.location.zipCode(),
  document: faker.string.numeric(11),
};

describe("CreateOrderRepository", () => {
  let createOrderRepository: CreateOrderRepository;

  beforeEach(() => {
    createOrderRepository = new CreateOrderRepository();
    jest.clearAllMocks();
  });

  it("should create an order successfully", async () => {
    const mockInsert = {
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockOrder]),
    };

    mockDb.insert.mockReturnValue(mockInsert);

    const result = await createOrderRepository.execute(mockOrder);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockInsert.values).toHaveBeenCalledWith({
      id: mockOrder.id,
      user_id: mockOrder.user_id,
      total: mockOrder.total,
      status: mockOrder.status,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
    expect(mockInsert.returning).toHaveBeenCalled();
    expect(result).toEqual(mockOrder);
  });
});
