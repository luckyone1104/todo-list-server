import { PrismaClient } from '@prisma/client'
import { Decimal } from "@prisma/client/runtime";
const prisma = new PrismaClient()

const listItems = [
  {
    description: 'Item #1',
    position: new Decimal(1)
  },
  {
    description: 'Item #2',
    position: new Decimal(2)
  },
  {
    description: 'Item #3',
    position: new Decimal(3)
  },
  {
    description: 'Item #4',
    position: new Decimal(4)
  },
  {
    description: 'Item #5',
    position: new Decimal(5)
  },
];

async function seed() {
  await prisma.todoList.create({
    data: {
      name: 'List #1',
      items: {
        createMany: {
          data: listItems
        }
      }
    }
  })
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
