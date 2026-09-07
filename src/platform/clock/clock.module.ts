import { Module } from '@nestjs/common';
import { SystemClock } from './system-clock.js';
import { CLOCK } from './clock.port.js';

@Module({
  providers: [
    {
      provide: CLOCK,
      useClass: SystemClock,
    },
  ],
  exports: [CLOCK],
})
export class ClockModule {}
