import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';

export async function generateResetToken(userId: string) {
  const token = uuidv4();
  const expires = new Date(Date.now() + 3600000); 

  await prisma.passwordResetToken.create({

    data: {
      token,
      userId,
      expires
    }
  });

  return token;
}