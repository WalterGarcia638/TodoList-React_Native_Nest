import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mockedAccessToken'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return a token', async () => {
      const registerDto: RegisterDto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const createdUser = { id: 1, email: registerDto.email, password: hashedPassword };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await authService.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          password: hashedPassword,
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: createdUser.id, email: createdUser.email });
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });
  });

  describe('login', () => {
    it('should return a token if credentials are valid', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'password123' };
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const existingUser = { id: 1, email: loginDto.email, password: hashedPassword };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: loginDto.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, existingUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: existingUser.id, email: existingUser.email });
      expect(result).toEqual({ access_token: 'mockedAccessToken' });
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      const loginDto: LoginDto = { email: 'nonexistent@example.com', password: 'password123' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const loginDto: LoginDto = { email: 'test@example.com', password: 'wrongpassword' };
      const existingUser = { id: 1, email: loginDto.email, password: await bcrypt.hash('password123', 10) };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrowError(UnauthorizedException);
    });
  });
});
