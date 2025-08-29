import { faker } from "@faker-js/faker";
import { GetUserByIdRepository } from "../get-user-by-id";
import { db } from "../../../db";
import { users } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("GetUserByIdRepository", () => {
  let getUserByIdRepository: GetUserByIdRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getUserByIdRepository = new GetUserByIdRepository();
  });

  it("should get user by id successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const userId = mockUser.id;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockUser]),
      }),
    } as any);

    const result = await getUserByIdRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(users);
    expect(result).toEqual([mockUser]);
  });

  it("should return empty array when user does not exist", async () => {
    const userId = faker.string.uuid();

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    const result = await getUserByIdRepository.execute(userId);

    expect(result).toEqual([]);
  });
});
