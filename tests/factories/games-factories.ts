import { prisma } from "@/config";
import faker from "@faker-js/faker";

export function createConsole() {
  return prisma.console.create({
    data: {
      name: faker.name.jobDescriptor()
    }
  });
}

export function createGame(consoleId: number) {
  return prisma.game.create({
    data: {
      title: faker.datatype.string(),
      consoleId
    }
  });
}
