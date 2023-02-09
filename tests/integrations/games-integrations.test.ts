import app from 'app';
import supertest from 'supertest'
import { cleanDb } from '../helpers';
import { init } from 'app';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createConsole, createGame } from '../factories/games-factories';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

let gameId: number;

describe("POST /games", () => {
  it("should respond with status 401 if no body is given", async () => {
    const response = await server.post("/games");

    expect(response.status).toBe(422);
  });

  it("should respond with status 200", async () => {
    const console = await createConsole()
    const body = {
      title: faker.lorem.text(),
      consoleId: console.id
    }
    const response = await server.post("/games").send(body);
    expect(response.status).toBe(httpStatus.CREATED);
  });
});


describe("GET /games", () => {
  it("Should respond with status 200/", async () => {
    const resultado = await server.get("/games");
    expect(resultado.status).toBe(200);
    expect(resultado.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          Console: {
            id: expect.any(Number),
            name: expect.any(String)
          },
          consoleId: expect.any(Number),
        }),
      ])
    );
  });
});

describe("GET /games/:id", () => {
  it("GET /games/:id", async () => {
    const resultado = await server.get(`/games/${-1}`);
    expect(resultado.status).toBe(httpStatus.NOT_FOUND);
  });

  it("GET /games/:id", async () => {
    let consoleId = (await createConsole()).id
    gameId = (await createGame(consoleId)).id
    const resultado = await server.get(`/games/${gameId}`);
    expect(resultado.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          consoleId: expect.any(Number)
        }),
      )
    expect(resultado.status).toBe(200);
  });
});

