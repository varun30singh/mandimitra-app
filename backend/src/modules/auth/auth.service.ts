import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // In-memory OTP storage for rapid verification in demo/hackathon
  private otpStore = new Map<string, { otp: string; expiresAt: number }>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async requestFarmerOtp(mobile: string) {
    if (!mobile || mobile.length < 10) {
      throw new BadRequestException('Valid 10-digit mobile number is required');
    }

    // Default demo OTP is 123456 for easy evaluation
    const otp = '123456';
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.otpStore.set(mobile, { otp, expiresAt });

    // Check if farmer already exists
    let user = await this.prisma.user.findUnique({
      where: { mobile },
      include: { farmer: true },
    });

    const isNewUser = !user;

    console.log(`[AUTH] OTP requested for ${mobile}: ${otp}`);

    return {
      message: 'OTP sent successfully to your mobile number',
      mobile,
      isNewUser,
      demoOtpHint: '123456',
    };
  }

  async verifyFarmerOtp(mobile: string, otp: string, fullName?: string, village?: string) {
    const stored = this.otpStore.get(mobile);
    const isValid = otp === '123456' || (stored && stored.otp === otp && stored.expiresAt > Date.now());

    if (!isValid) {
      throw new UnauthorizedException('Invalid or expired OTP. Please use 123456.');
    }

    let user = await this.prisma.user.findUnique({
      where: { mobile },
      include: { farmer: true },
    });

    if (!user) {
      // Create new farmer
      const generatedFarmerId = `MH-NAS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      user = await this.prisma.user.create({
        data: {
          mobile,
          role: Role.FARMER,
          farmer: {
            create: {
              farmerId: generatedFarmerId,
              fullName: fullName || 'Kisan Sahayak',
              mobile,
              village: village || 'Pimpalgaon',
              taluka: 'Niphad',
              district: 'Nashik',
              state: 'Maharashtra',
              preferredLanguage: 'hi',
              defaultCrop: 'Wheat',
              defaultQuantity: 50.0,
            },
          },
        },
        include: { farmer: true },
      });
    }

    this.otpStore.delete(mobile);

    const payload = {
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
      farmerId: user.farmer?.id,
      farmerCode: user.farmer?.farmerId,
      name: user.farmer?.fullName,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
        farmer: user.farmer,
      },
    };
  }

  async registerFarmer(data: {
    fullName: string;
    mobile: string;
    password: string;
    aadhaarNumber?: string;
    area?: string;
  }) {
    const { fullName, mobile, password, aadhaarNumber, area } = data;

    if (!mobile || mobile.length < 10) {
      throw new BadRequestException('A valid 10-digit mobile number is required');
    }
    if (!password || password.length < 4) {
      throw new BadRequestException('Password must be at least 4 characters');
    }

    const existing = await this.prisma.user.findUnique({
      where: { mobile },
    });
    if (existing) {
      throw new BadRequestException('An account with this mobile number already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const generatedFarmerId = `MH-NAS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const user = await this.prisma.user.create({
      data: {
        mobile,
        passwordHash,
        role: Role.FARMER,
        farmer: {
          create: {
            farmerId: generatedFarmerId,
            fullName,
            mobile,
            village: area || 'Pimpalgaon Baswant',
            taluka: area || 'Niphad',
            district: 'Nashik',
            state: 'Maharashtra',
            preferredLanguage: 'hi',
            defaultCrop: 'Wheat',
            defaultQuantity: 50.0,
            registrationStatus: 'VERIFIED',
          },
        },
      },
      include: { farmer: true },
    });

    return {
      success: true,
      message: 'Farmer account created successfully',
      farmerId: user.farmer?.farmerId,
      mobile: user.mobile,
      fullName: user.farmer?.fullName,
    };
  }

  async loginWithCredentials(mobile: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { mobile },
      include: {
        admin: true,
        operator: {
          include: { centre: true },
        },
        farmer: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid mobile number or password');
    }

    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid mobile number or password');
      }
    } else {
      // For demo accounts where passwordHash wasn't set, allow standard demo password
      if (password !== '1234' && password !== '123456' && password !== 'farmer123' && password !== 'password') {
        throw new UnauthorizedException('Invalid password. For demo farmer, use 1234 or 123456.');
      }
    }

    const payload = {
      sub: user.id,
      mobile: user.mobile,
      role: user.role,
      name: user.farmer?.fullName || user.admin?.fullName || user.operator?.fullName,
      centreId: user.operator?.centreId,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        mobile: user.mobile,
        role: user.role,
        farmer: user.farmer,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        admin: true,
        operator: {
          include: { centre: true },
        },
        farmer: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User profile not found');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
