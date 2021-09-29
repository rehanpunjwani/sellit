import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DateScalar } from './common/scalars/date.scalar';
import config from './configs/config';
import { InventoryModule } from './inventory/inventory.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, load: [config],
    }),
    PrismaModule,
    InventoryModule,
  ],
  providers: [DateScalar],
})
export class AppModule { }
