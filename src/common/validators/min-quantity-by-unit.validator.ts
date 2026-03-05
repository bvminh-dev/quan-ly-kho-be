import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { UnitOfCalculation } from '../enums/index.js';

export function IsMinQuantityByUnit(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMinQuantityByUnit',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const obj = args.object as { unitOfCalculation?: string };
          if (typeof value !== 'number') return false;
          if (obj.unitOfCalculation === UnitOfCalculation.KG) {
            return value >= 0.1;
          }
          return value >= 1;
        },
        defaultMessage(args: ValidationArguments) {
          const obj = args.object as { unitOfCalculation?: string };
          const min = obj.unitOfCalculation === UnitOfCalculation.KG ? 0.1 : 1;
          return `${args.property} must not be less than ${min}`;
        },
      },
    });
  };
}
