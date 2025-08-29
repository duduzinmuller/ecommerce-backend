import { faker } from "@faker-js/faker";
import { CreateUserRepository } from "../create-user";
import { db } from "../../../db";
import { users } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("CreateUserRepository", () => {
  let createUserRepository: CreateUserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    createUserRepository = new CreateUserRepository();
  });

  it("should create a user successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockCreatedUser = [mockUser];

    mockDb.insert.mockReturnValue({
      values: jest.fn().mockReturnValue({
        returning: jest.fn().mockResolvedValue(mockCreatedUser),
      }),
    } as any);

    const result = await createUserRepository.execute(mockUser);

    expect(mockDb.insert).toHaveBeenCalledWith(users);
    expect(result).toEqual(mockCreatedUser);
  });
});
