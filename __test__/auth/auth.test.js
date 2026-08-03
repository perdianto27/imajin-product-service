jest.mock("../../src/config/database");

jest.mock('../../src/models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn()
  },
  UserSession: {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn()
  }
}));

const request = require('supertest');
const TestHelper = require('../testHelper');
const AuthRoutes = require('../../src/routes/AuthRoutes');
const { User, UserSession } = require("../../src/models");

let server;

describe("Auth Controller", () => {
  beforeAll(() => {
    server = TestHelper.createTestServer('/auth', AuthRoutes);
    process.env.JWT_SECRET = 'supersecretjwtkey123';
    process.env.JWT_EXPIRES = '1h';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await server.close();
  });

  test("It should return 200: Successful user login and session creation", async () => {
    const mockUser = {
      id: 9,
      email: "dira@gmail.com",
      role_id: 1,
      is_active: true
    };

    User.findOne.mockResolvedValue(mockUser);
    UserSession.destroy.mockResolvedValue(1);
    UserSession.create.mockResolvedValue({
      id: 62,
      email: "dira@gmail.com",
      token: "mock-token"
    });

    await request(server)
      .post('/auth/login')
      .send({ email: "dira@gmail.com" })
      .expect(200)
      .then((res) => {
        expect(res.body.responseCode).toEqual(200);
        expect(res.body.data.email).toEqual("dira@gmail.com");
        expect(res.body.data.access_token).toBeDefined();
      });
  });

  test("It should return 404: User not found", async () => {
    User.findOne.mockResolvedValue(null);

    await request(server)
      .post('/auth/login')
      .send({ email: "unknown@gmail.com" })
      .expect(404)
      .then((res) => {
        expect(res.body.responseCode).toEqual(404);
        expect(res.body.responseDesc).toEqual("User tidak ditemukan");
      });
  });
});
