import { PrismaClient } from '@prisma/client';
import * as ngeohash from 'ngeohash';

const prisma = new PrismaClient();

async function main() {
  // 1. Seed cuisines
  const cuisines = await prisma.cuisine.createMany({
    data: [
      { name: 'Italian', price: 3 },
      { name: 'Japanese', price: 4 },
      { name: 'Mexican', price: 2 },
      { name: 'Indian', price: 2 },
      { name: 'French', price: 5 },
    ],
    skipDuplicates: true,
  });

  console.log(`Seeded ${cuisines.count} cuisines.`);

  // Fetch cuisines to attach them to restaurants
  const cuisineMap = await prisma.cuisine.findMany();

  // 2. Seed restaurants
  const restaurantsData = [
    {
      name: 'Pasta Palace',
      latitude: 40.73061,
      longitude: -73.935242,
      open: true,
      cuisine: 'Italian',
    },
    {
      name: 'Sushi World',
      latitude: 40.764356,
      longitude: -73.923462,
      open: true,
      cuisine: 'Japanese',
    },
    {
      name: 'Taco Haven',
      latitude: 40.678178,
      longitude: -73.944158,
      open: false,
      cuisine: 'Mexican',
    },
    {
      name: 'Curry Corner',
      latitude: 40.789142,
      longitude: -74.05653,
      open: true,
      cuisine: 'Indian',
    },
  ];

  for (const restaurant of restaurantsData) {
    const cuisine = cuisineMap.find((c) => c.name === restaurant.cuisine);
    if (!cuisine) continue;

    await prisma.restaurant.create({
      data: {
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        geohash: ngeohash.encode(restaurant.latitude, restaurant.longitude),
        open: restaurant.open,
        cuisineId: cuisine.id,
      },
    });
  }

  console.log('Seeded restaurants.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
