import { faker } from "@faker-js/faker";
import { DeleteUserRepository } from "../delete-user";
import { db } from "../../../db";
import { users } from "../../../db/schema";

jest.mock("../../../db", () => ({
  db: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn(),
    delete: jest.fn().mockReturnThis(),
  },
}));

const mockDb = db as jest.Mocked<typeof db>;

describe("DeleteUserRepository", () => {
  let deleteUserRepository: DeleteUserRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    deleteUserRepository = new DeleteUserRepository();
  });

  it("should delete a user successfully", async () => {
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

    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as any);

    const result = await deleteUserRepository.execute(userId);

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalledWith(users);
    expect(mockDb.delete).toHaveBeenCalledWith(users);
    expect(result).toEqual(mockUser);
  });

  it("should return undefined when user does not exist", async () => {
    const userId = faker.string.uuid();

    mockDb.select.mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockResolvedValue([]),
      }),
    } as any);

    mockDb.delete.mockReturnValue({
      where: jest.fn().mockResolvedValue(undefined),
    } as any);

    const result = await deleteUserRepository.execute(userId);

    expect(result).toBeUndefined();
  });
});
