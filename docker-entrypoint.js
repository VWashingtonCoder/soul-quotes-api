#!/usr/bin/env node

const { spawn } = require("node:child_process");

const env = { ...process.env };

(async () => {
  // If running the web server then migrate existing database
  if (process.argv.slice(2).join(" ") === "npm run start") {
    await exec("npx prisma migrate deploy");
    await seedDatabase();
  }

  // launch application
  await exec(process.argv.slice(2).join(" "));
})();

function exec(command) {
  const child = spawn(command, { shell: true, stdio: "inherit", env });
  return new Promise((resolve, reject) => {
  
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} failed rc=${code}`));
      }
    });
  });
}

// Function to seed the database
async function seedDatabase() {
  try {
    console.log('Seeding database...');
    await exec('node /app/prisma/seed.js');
    console.log('Database seeded successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit the process with an error code
  }
}