import { faker } from "@faker-js/faker";
import { LoginUserUseCase } from "../login-user";
import { GetUserByEmailRepository } from "../../../repositories/users/get-user-by-email";
import { PasswordComparatorAdapter } from "../../../adapters/password-comparator";
import { TokensGeneratorAdapter } from "../../../adapters/token-generator";
import { InvalidPasswordError, UserNotFoundError } from "../../../error/user";

const mockGetUserByEmailRepository = {
  execute: jest.fn(),
} as jest.Mocked<GetUserByEmailRepository>;

const mockPasswordComparatorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<PasswordComparatorAdapter>;

const mockTokensGeneratorAdapter = {
  execute: jest.fn(),
} as jest.Mocked<TokensGeneratorAdapter>;

const loginUserUseCase = new LoginUserUseCase(
  mockGetUserByEmailRepository,
  mockPasswordComparatorAdapter,
  mockTokensGeneratorAdapter,
);

describe("LoginUserUseCase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should login user successfully", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockTokens = {
      accessToken: "access_token",
      refreshToken: "refresh_token",
    };
    const email = mockUser.email;
    const password = "plain_password";

    mockGetUserByEmailRepository.execute.mockResolvedValue(mockUser);
    mockPasswordComparatorAdapter.execute.mockResolvedValue(true);
    mockTokensGeneratorAdapter.execute.mockReturnValue(mockTokens);

    const result = await loginUserUseCase.execute(email, password);

    expect(mockGetUserByEmailRepository.execute).toHaveBeenCalledWith(email);
    expect(mockPasswordComparatorAdapter.execute).toHaveBeenCalledWith(
      password,
      mockUser.password,
    );
    expect(mockTokensGeneratorAdapter.execute).toHaveBeenCalledWith(
      mockUser.id,
    );
    expect(result).toEqual({
      ...mockUser,
      tokens: mockTokens,
    });
  });

  it("should throw UserNotFoundError when user does not exist", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    mockGetUserByEmailRepository.execute.mockResolvedValue(null);

    await expect(loginUserUseCase.execute(email, password)).rejects.toThrow(
      UserNotFoundError,
    );

    expect(mockGetUserByEmailRepository.execute).toHaveBeenCalledWith(email);
    expect(mockPasswordComparatorAdapter.execute).not.toHaveBeenCalled();
    expect(mockTokensGeneratorAdapter.execute).not.toHaveBeenCalled();
  });

  it("should throw InvalidPasswordError when password is incorrect", async () => {
    const mockUser = {
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "hashed_password_123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const email = mockUser.email;
    const password = "wrong_password";

    mockGetUserByEmailRepository.execute.mockResolvedValue(mockUser);
    mockPasswordComparatorAdapter.execute.mockResolvedValue(false);

    await expect(loginUserUseCase.execute(email, password)).rejects.toThrow(
      InvalidPasswordError,
    );

    expect(mockGetUserByEmailRepository.execute).toHaveBeenCalledWith(email);
    expect(mockPasswordComparatorAdapter.execute).toHaveBeenCalledWith(
      password,
      mockUser.password,
    );
    expect(mockTokensGeneratorAdapter.execute).not.toHaveBeenCalled();
  });
});
