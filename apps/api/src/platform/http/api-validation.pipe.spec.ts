import type { ArgumentMetadata } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { RequestValidationError } from '../errors/request-validation.error.js';
import { ApiValidationPipe } from './api-validation.pipe.js';

class ValidationProbeDto {
  @IsString()
  @Length(2, 20)
  public name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  public count!: number;
}

const metadata: ArgumentMetadata = {
  type: 'body',
  metatype: ValidationProbeDto,
};

describe('ApiValidationPipe', () => {
  it('creates a DTO and performs explicit conversion', async () => {
    const pipe = new ApiValidationPipe();

    const result = await pipe.transform(
      {
        name: 'Ada',
        count: '3',
      },
      metadata,
    );

    expect(result).toBeInstanceOf(ValidationProbeDto);

    expect(result).toMatchObject({
      name: 'Ada',
      count: 3,
    });
  });

  it('returns stable validation issues', async () => {
    const pipe = new ApiValidationPipe();

    try {
      await pipe.transform(
        {
          name: 'A',
          count: 0,
          is_admin: true,
        },
        metadata,
      );

      throw new Error('Expected validation to fail.');
    } catch (error: unknown) {
      if (!(error instanceof RequestValidationError)) {
        throw error;
      }

      expect(error.code).toBe('validation_failed');

      const issues = error.details['issues'];

      expect(Array.isArray(issues)).toBe(true);

      expect(JSON.stringify(issues)).not.toContain('true');

      expect(JSON.stringify(issues)).toContain('is_admin');
    }
  });
});
