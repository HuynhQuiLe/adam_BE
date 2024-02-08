import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import {ConfigModule} from'@nestjs/config'
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { SocialModule } from './social/social.module';
import { CreatorModule } from './creator/creator.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), UserModule, RoleModule, SocialModule, CreatorModule, BrandModule],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
