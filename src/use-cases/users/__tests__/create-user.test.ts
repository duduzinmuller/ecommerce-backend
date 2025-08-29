import { faker } from "@faker-js/faker";
import { CreateUserUseCase } from "../create-user";
import { CreateUserRepository } from "../../../repositories/users/create-user";
import { GetUserByEmailRepository } from "../../../repositories/users/get-user-by-email";
import { IdGeneratorAdapter } from "../../../adapters/id-generator";
import { PasswordHasherAdapter } from "../../../adapters/password-hasher";
import { TokensGeneratorAdapter } from "../../../adapters/token-generator";
import { EmailAlreadyInUseError } from "../../../error/user";

const mockCreateUserRepository = {
  execute: jest.fn(),
} as jest.Mocked<CreateUserRepository>;

const mockGetUserByEmailRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetUserByEmailRepository>;

const mockIdGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<IdGeneratorAdapter>;

const mockPasswordHasherAdapter = {
  execute: jest.fn(),
} as jest.Mocked<PasswordHasherAdapter>;

const mockTokensGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<TokensGeneratorAdapter>;

const createUserUseCase = new CreateUserUseCase(
  mockCreateUserRepository,
  mockGetUserByEmailRepository,
  mockIdGeneratorAdapter,
  mockPasswordHasherAdapter,
  mockTokensGeneratorAdapter,
);

describe("CreateUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const mockHashedPassword = "hashed_password_123";
    const mockTokens = {
      accessToken: "access_token",
      refreshToken: "refresh_token",
    };

    mockGetUserByEmailRepository.execute.mockResolvedValue(null);
    mockIdGeneratorAdapter.execute.mockResolvedValue(mockUser.id);
    mockPasswordHasherAdapter.execute.mockResolvedValue(mockHashedPassword);
    mockCreateUserRepository.execute.mockResolvedValue({
      ...mockUser,
      password: mockHashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockTokensGeneratorAdapter.execute.mockReturnValue(mockTokens);

    const result = await createUserUseCase.execute(mockUser);

    expect(mockGetUserByEmailRepository.execute).toHaveBeenCalledWith(
      mockUser.email,
    );
    expect(mockIdGeneratorAdapter.execute).toHaveBeenCalled();
    expect(mockPasswordHasherAdapter.execute).toHaveBeenCalledWith(
      mockUser.password,
    );
    expect(mockCreateUserRepository.execute).toHaveBeenCalledWith({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      password: mockHashedPassword,
    });
    expect(mockTokensGeneratorAdapter.execute).toHaveBeenCalledWith(
      mockUser.id,
    );
    expect(result).toHaveProperty("tokens", mockTokens);
  });

  it("should throw EmailAlreadyInUseError when email is already in use", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const existingUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: mockUser.email,
      password: "existing_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockGetUserByEmailRepository.execute.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(mockUser)).rejects.toThrow(
      EmailAlreadyInUseError,
    );

    expect(mockGetUserByEmailRepository.execute).toHaveBeenCalledWith(
      mockUser.email,
    );
    expect(mockCreateUserRepository.execute).not.toHaveBeenCalled();
  });
});
