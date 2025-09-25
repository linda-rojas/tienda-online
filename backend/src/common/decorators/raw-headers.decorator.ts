import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data: string, context: ExecutionContext): string[] => {
        const req = context.switchToHttp().getRequest();
        return req.rawHeaders;
    }
);