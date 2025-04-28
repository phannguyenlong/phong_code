import bcrypt from 'bcryptjs';

async function login(inputPassword, storedHashedPassword) {
  const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);

  if (isMatch) {
    console.log('✅ Passwords match! User can log in.');
  } else {
    console.log('❌ Passwords do not match! Access denied.');
  }
}

// Example usage:

// const hashedPasswordInDatabase = await bcrypt.hash('admin123', 10); // This would normally be saved earlier
const hashedPasswordInDatabase = "$2a$10$/lvWZH8huRua5crtiJZJZOvj8wbHwt6qJJynZd8YXtEKhNDTQ5d3S"


console.log(hashedPasswordInDatabase)
await login('admin123', hashedPasswordInDatabase);
await login('wrongpassword', hashedPasswordInDatabase); 
