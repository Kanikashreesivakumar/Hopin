import bcrypt from 'bcryptjs';

const passwords = ['Admin@123'];

passwords.forEach(async (pw, i) => {
  const hash = await bcrypt.hash(pw, 10);
  console.log(`User${i + 1} hash: ${hash}`);
});
