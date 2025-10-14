// src/utils/bcrypt.util.ts
import * as bcrypt from 'bcrypt';

/**
 * Hashea una contraseña usando bcrypt con 10 salt rounds
 * @param plainPassword Contraseña sin encriptar
 * @returns Contraseña encriptada
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, 10);
};


// src/utils/bcrypt.util.ts
export const comparePasswords = async (plainText: string, hashed: string): Promise<boolean> => {
    return await bcrypt.compare(plainText, hashed);
};

