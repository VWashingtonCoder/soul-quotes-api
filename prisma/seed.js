const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

const seedDatabase = async () => {
  console.log("Seeding database");
  try {
    // Create/Update users
    const users = [
      {
        username: "admin",
        email: "admin1@localhost.com",
        passwordHash: await hashPassword(process.env.ADMIN_PASSWORD || ""),
      },
      {
        username: "admin_andre",
        email: "andre@admin.com",
        passwordHash: await hashPassword(process.env.USER_PASSWORD || ""),
      },
    ];

    for (const user of users) {
      await prisma.user.upsert({
        where: {
          username: user.username,
        },
        update: {},
        create: user,
      });
    }

    // Create/Update quotes
    const quotes = [
      {
        quoteKey: "inspirational-1",
        text: "Change will not come if we wait for some other person or some other time. We are the ones we've been waiting for. We are the change that we seek.",
        author: "Barack Obama",
        category: "inspirational",
        creatorId: "admin",
      },
      {
        quoteKey: "inspirational-2",
        text: "The cost of liberty is less than the price of repression.",
        author: "W.E.B. Du Bois",
        category: "inspirational",
        creatorId: "admin",
      },
      {
        quoteKey: "inspirational-3",
        text: "Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly.",
        author: "Langston Hughes",
        category: "inspirational",
        creatorId: "admin",
      },
      {
        quoteKey: "inspirational-4",
        text: "Don't give up, there's no shame in falling down! True shame is to not stand up again!",
        author: "Naruto (Shippuden)",
        category: "inspirational",
        creatorId: "admin",
      },
      {
        quoteKey: "inspirational-5",
        text: "Believe in yourself. Not in the you who believes in me. Not the me who believes in you. Believe in the you who believes in yourself.",
        author: "Kamina (Gurren Lagann)",
        category: "inspirational",
        creatorId: "admin",
      },
      {
        quoteKey: "love-1",
        text: "Love recognizes no barriers. It jumps hurdles, leaps fences, penetrates walls to arrive at its destination full of hope.",
        author: "Maya Angelou",
        category: "love",
        creatorId: "admin",
      },
      {
        quoteKey: "love-2",
        text: "Love is an endless act of forgiveness. Forgiveness is an endless act of love.",
        author: "Coretta Scott King",
        category: "love",
        creatorId: "admin",
      },
      {
        quoteKey: "love-3",
        text: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day",
        author: "Steve Harvey",
        category: "love",
        creatorId: "admin",
      },
      {
        quoteKey: "love-4",
        text: "I love you not because of who you are, but because of who I am when I am with you.",
        author: "Roy Mustang (Fullmetal Alchemist)",
        category: "love",
        creatorId: "admin",
      },
      {
        quoteKey: "love-5",
        text: "Love doesn't need a reason. Pure love will come from the heart without reason and it'll stay every season.",
        author: "Mamoru Chiba (Sailor Moon)",
        category: "love",
        creatorId: "admin",
      },
      {
        quoteKey: "philosophy-1",
        text: "If you want to lift yourself up, lift up someone else.",
        author: "Booker T. Washington",
        category: "philosophy",
        creatorId: "admin",
      },
      {
        quoteKey: "philosophy-2",
        text: "I am not what I ought to be, I am not what I want to be, I am not what I hope to be, but still, I am not what I used to be, and by the grace of God, I am what I am.",
        author: "Frederick Douglass",
        category: "philosophy",
        creatorId: "admin",
      },
      {
        quoteKey: "philosophy-3",
        text: "We must learn to live together as brothers or perish together as fools.",
        author: "Martin Luther King Jr.",
        category: "philosophy",
        creatorId: "admin",
      },
      {
        quoteKey: "philosophy-4",
        text: "The world is full of empty words. What matters is how you act.",
        author: "Makishima Shogo (Psycho-Pass)",
        category: "philosophy",
        creatorId: "admin",
      },
      {
        quoteKey: "philosophy-5",
        text: "In this world, there are things you can only do alone, and things you can only do with somebody else. It's important to combine the two in just the right amount.",
        author: "Yui Hirasawa (K-On!)",
        category: "philosophy",
        creatorId: "admin",
      },
      {
        quoteKey: "success-1",
        text: "",
        author: "",
        category: "success",
        creatorId: "admin",
      },
      {
        quoteKey: "success-2",
        text: "Success is to be measured not so much by the position that one has reached in life as by the obstacles which he has overcome while trying to succeed.",
        author: "Booker T. Washington",
        category: "success",
        creatorId: "admin",
      },
      {
        quoteKey: "success-3",
        text: "Success is not about how much money you make; it's about the difference you make in people's lives.",
        author: "Michelle Obama",
        category: "success",
        creatorId: "admin",
      },
      {
        quoteKey: "success-4",
        text: "If you don't take risks, you can't create a future.",
        author: "Monkey D. Luffy (One Piece)",
        category: "success",
        creatorId: "admin",
      },
      {
        quoteKey: "success-5",
        text: "Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful.",
        author: "Albert Schweitzer",
        category: "success",
        creatorId: "admin",
      },
      {
        quoteKey: "funny-1",
        text: "I'm not addicted to games; I'm committed to them.",
        author: "Hasegawa Taizou (Gintama)",
        category: "funny",
        creatorId: "admin",
      },
      {
        quoteKey: "funny-2",
        text: "I'm not crazy. My reality is just different from yours.",
        author: "Alice (Pandora Hearts)",
        category: "funny",
        creatorId: "admin",
      },
      {
        quoteKey: "funny-3",
        text: "I don't suffer from insanity. I enjoy every minute of it!",
        author: "Izaya Orihara (Durarara!!)",
        category: "funny",
        creatorId: "admin",
      },
      {
        quoteKey: "funny-4",
        text: "People say money is not the key to happiness, but I have always figured if you have enough money, you can have a key made.",
        author: "Joan Rivers",
        category: "funny",
        creatorId: "admin",
      },
      {
        quoteKey: "funny-5",
        text: "Do not take life too seriously. You will never get out of it alive.",
        author: "Elbert Hubbard",
        category: "funny",
        creatorId: "admin",
      },
    ];

    for (const quote of quotes) {
      await prisma.quote.upsert({
        where: {
          quoteKey: quote.quoteKey,
        },
        update: {},
        create: quote,
      });
    }

    // Create favorites
    const favorites = [
      {
        quoteId: "inspirational-1",
        userId: "admin",
      },
      {
        quoteId: "love-3",
        userId: "admin",
      },
      {
        quoteId: "funny-5",
        userId: "admin",
      },
      {
        quoteId: "success-2",
        userId: "admin_andre",
      },
      {
        quoteId: "philosophy-4",
        userId: "admin_andre",
      },
    ];

    for (let id = 1; id < favorites.length + 1; id++) { 
      await prisma.favorite.upsert({
        where: {
          id
        },
        update: {},
        create: favorites[id],
      });
    }

    console.log("Seeding complete");
  } catch (err) {
    console.error(`Error seeding database: ${err}`);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
