import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string, contex: ExecutionContext) => {
        const req = contex.switchToHttp().getRequest();
        const user = req.user;

        if (!user) {
            throw new Error('Usuario no encontrado (request)');
        }

        return (!data) ? user : user[data];
    }
)