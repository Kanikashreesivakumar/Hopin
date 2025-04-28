import bcrypt from 'bcryptjs';

const passwords = ['654321', '123456'];

passwords.forEach(async (pw, i) => {
  const hash = await bcrypt.hash(pw, 10);
  console.log(`User${i + 1} hash: ${hash}`);
});
