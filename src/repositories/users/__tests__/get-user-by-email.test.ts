import { faker } from "@faker-js/faker";
import { GetUserByEmailRepository } from "../get-user-by-email";
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

describe("GetUserByEmailRepository", () => {
  let getUserByEmailRepository: GetUserByEmailRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    getUserByEmailRepository = new GetUserByEmailRepository();
  });

  it("should get user by email successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const email = mockUser.email;

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([mockUser]),
      }),
    } as any);

    const result = await getUserByEmailRepository.execute(email);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(users);
    expect(result).toEqual(mockUser);
  });

  it("should return null when user does not exist", async () => {
    const email = faker.internet.email();

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    const result = await getUserByEmailRepository.execute(email);

    expect(result).toBeNull();
  });
});
