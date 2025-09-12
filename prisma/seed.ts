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
      latitude: 41.9028,
      longitude: 12.4964,
      open: true,
      cuisine: 'Italian',
    },
    {
      name: 'Sushi World',
      latitude: 35.6895,
      longitude: 139.6917,
      open: true,
      cuisine: 'Japanese',
    },
    {
      name: 'Taco Haven',
      latitude: 19.4326,
      longitude: -99.1332,
      open: false,
      cuisine: 'Mexican',
    },
    {
      name: 'Curry Corner',
      latitude: 28.6139,
      longitude: 77.209,
      open: true,
      cuisine: 'Indian',
    },
    {
      name: 'Le Petit Bistro',
      latitude: 48.8566,
      longitude: 2.3522,
      open: true,
      cuisine: 'French',
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
