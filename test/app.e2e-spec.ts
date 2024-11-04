import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from "../src/app.module";
import * as pactum from "pactum";
import { AuthDto } from "../src/auth/dto";
import { EditUserDto } from "../src/user/dto";
import { CreateBookmarkDto } from "../src/bookmark/dto";

describe("App e2e", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3333");
  });
  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    const dto: AuthDto = {
      email: "sam@yahoo.com",
      password: "123",
    };
    describe("Signup", () => {
      it("should throw if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it("should throw if password empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it("should signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201)
          .inspect();
      });
    });
    describe("Login", () => {
      it("should login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody(dto)
          .expectStatus(201)
          .stores("userAt", "access_token");
      });
    });
  });

  describe("User", () => {
    describe("Get me", () => {
      it("should get current user", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: `Bearer $S{userAt}`,
          })
          .expectStatus(200);
      });
    });
    describe("Edit user", () => {
      it("should edit user", () => {
        const dto: EditUserDto = {
          firstName: "sam",
          email: "sam@gmail.com",
        };
        return pactum
          .spec()
          .patch("/users")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });

  describe("Bookmarks", () => {
    describe("Get empty bookmarks", () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe("Create bookmark", () => {
      const dto: CreateBookmarkDto = {
        title: "first bookmark",
        description: "lorem ipsum",
        link: "https://dev.to/kda/enhancing-javascript-code-with-es-modules-export-import-and-beyond-1d5",
      };
      it("should create bookmarks", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBody("");
      });
    });
    describe("Get bookmark", () => {});
    describe("Get bookmark by id", () => {});
    describe("Edit bookmark by id", () => {});
    describe("Delete bookmark by id", () => {});
  });
});
