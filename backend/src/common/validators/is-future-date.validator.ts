import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    if (!value) return false;
                    const now = new Date();
                    const inputDate = new Date(value);
                    return inputDate >= now;
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} debe ser una fecha futura`;
                },
            },
        });
    };
}