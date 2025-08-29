import { faker } from "@faker-js/faker";
import { GetUserByIdUseCase } from "../get-user-by-id";
import { GetUserByIdRepository } from "../../../repositories/users/get-user-by-id";

const mockGetUserByIdRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetUserByIdRepository>;

const getUserByIdUseCase = new GetUserByIdUseCase(mockGetUserByIdRepository);

describe("GetUserByIdUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get user by id successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userId = mockUser.id;

    mockGetUserByIdRepository.execute.mockResolvedValue(mockUser);

    const result = await getUserByIdUseCase.execute(userId);

    expect(mockGetUserByIdRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockUser);
  });

  it("should return null when user does not exist", async () => {
    const userId = faker.string.uuid();

    mockGetUserByIdRepository.execute.mockResolvedValue(null);

    const result = await getUserByIdUseCase.execute(userId);

    expect(mockGetUserByIdRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });
});
