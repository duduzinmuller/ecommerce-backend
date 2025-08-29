import { faker } from "@faker-js/faker";
import { DeleteUserUseCase } from "../delete-user";
import { DeleteUserRepository } from "../../../repositories/users/delete-user";

const mockDeleteUserRepository = {
  execute: jest.fn(),
} as jest.Mocked<DeleteUserRepository>;

const deleteUserUseCase = new DeleteUserUseCase(mockDeleteUserRepository);

describe("DeleteUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete user successfully", async () => {
    const mockDeletedUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userId = mockDeletedUser.id;

    mockDeleteUserRepository.execute.mockResolvedValue(mockDeletedUser);

    const result = await deleteUserUseCase.execute(userId);

    expect(mockDeleteUserRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toEqual(mockDeletedUser);
  });

  it("should return null when user does not exist", async () => {
    const userId = faker.string.uuid();

    mockDeleteUserRepository.execute.mockResolvedValue(null);

    const result = await deleteUserUseCase.execute(userId);

    expect(mockDeleteUserRepository.execute).toHaveBeenCalledWith(userId);
    expect(result).toBeNull();
  });
});
