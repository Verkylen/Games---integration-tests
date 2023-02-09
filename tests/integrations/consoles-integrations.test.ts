import app from 'app';
import supertest from 'supertest'
import { cleanDb } from '../helpers';
import { init } from 'app';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { createConsole } from '../factories/games-factories';

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /consoles", () => {
    it("Should respond with status 200/", async () => {
        const body = {
          name: faker.lorem.text(),
        }
        const response = await server.post("/consoles").send(body);
        expect(response.status).toBe(httpStatus.CREATED);
    });
    it("should respond with status 401 if no body is given", async () => {
        
        const response = await server.post("/consoles");
        expect(response.status).toBe(422);
    });
});

describe("GET /consoles", () => {
  it("Should respond with status 200", async () => {
    const response = await server.get("/consoles");

    expect(response.status).toBe(httpStatus.OK);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        })
      ])
    );
  });
});

describe("GET /consoles/:id", () => {
  it("Should respond with status 200", async () => {
    const console = await createConsole();

    const response = await server.get("/consoles/" + console.id);

    expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
        }),
      );
  });
  
  it("Should respond with status 404", async () => {

    const response = await server.get("/consoles/" + -1);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});

