const {
  test,
  expect,
  beforeAll,
  afterAll,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Cuisine, Category, sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const fs = require("fs").promises;

let access_token_admin;
let access_token_staff;

beforeEach(async () => {
  let rows = JSON.parse(await fs.readFile("./data/users.json", "utf8"));
  rows = rows.map((row) => {
    delete row.id;
    row.password = hashPassword(row.password);
    row.createdAt = new Date();
    row.updatedAt = new Date();
    return row;
  });
  await sequelize.queryInterface.bulkInsert("Users", rows);
  console.log(rows[0]);

  rows = JSON.parse(await fs.readFile("./data/categories.json", "utf8"));
  rows = rows.map((row) => {
    delete row.id;
    row.createdAt = new Date();
    row.updatedAt = new Date();
    return row;
  });
  await sequelize.queryInterface.bulkInsert("Categories", rows);
  console.log(rows[0]);

  rows = JSON.parse(await fs.readFile("./data/cuisines.json", "utf8"));
  rows = rows.map((row) => {
    delete row.id;
    row.createdAt = new Date();
    row.updatedAt = new Date();
    return row;
  });
  await sequelize.queryInterface.bulkInsert("Cuisines", rows);
  console.log(rows[0]);

  const user = await User.findOne({
    where: {
      email: "tesadmin@mail.com",
    },
  });
  access_token_admin = signToken({ id: user.id });

  const userStaff = await User.findOne({
    where: {
      email: "tesstaff@mail.com",
    },
  });
  access_token_staff = signToken({ id: userStaff.id });
});

afterEach(async () => {
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Cuisine.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await Category.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Login (Admin), perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil login dan mengirimkan access_token", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "tesstaff@mail.com",
        password: "aaaaa",
      })
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  test("Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "",
        password: "aaaaa",
      })
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Password tidak diberikan / tidak diinput", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "tesstaff@mail.com",
        password: "",
      })
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Email diberikan invalid / tidak terdaftar", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "tesstaff1@mail.com",
        password: "aaaaa",
      })
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("Password diberikan salah / tidak match", async () => {
    const response = await request(app)
      .post("/login")
      .send({
        email: "tesstaff@mail.com",
        password: "aa",
      })
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

describe("Create, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil membuat Cuisine", async () => {
    const response = await request(app)
      .post("/cuisines")
      .send({
        name: "tes",
        description: "tes",
        price: 2000,
        imgUrl: "tes",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 22);
    expect(response.body).toHaveProperty("name", "tes");
    expect(response.body).toHaveProperty("description", "tes");
    expect(response.body).toHaveProperty("price", 2000);
    expect(response.body).toHaveProperty("imgUrl", "tes");
    expect(response.body).toHaveProperty("categoryId", 1);
    expect(response.body).toHaveProperty("authorId", 2);
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).post("/cuisines").send({
      name: "tes",
      description: "tes",
      price: 2000,
      imgUrl: "tes",
      categoryId: 1,
      authorId: 2,
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/cuisines")
      .send({
        name: "tes",
        description: "tes",
        price: 2000,
        imgUrl: "tes",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal ketika request body tidak sesuai (validation required)", async () => {
    const response = await request(app)
      .post("/cuisines")
      .send({
        name: "",
        description: "tes",
        price: 2000,
        imgUrl: "tes",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "name is required");
  });
});

describe("Update PUT, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil mengupdate data Cuisine berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .put("/cuisines/21")
      .send({
        name: "tes edit 21",
        description: "tes edit 21",
        price: 2000,
        imgUrl: "tes edit",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 21);
    expect(response.body).toHaveProperty("name", "tes edit 21");
    expect(response.body).toHaveProperty("description", "tes edit 21");
    expect(response.body).toHaveProperty("price", 2000);
    expect(response.body).toHaveProperty("imgUrl", "tes edit");
    expect(response.body).toHaveProperty("categoryId", 1);
    expect(response.body).toHaveProperty("authorId", 2);
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).put("/cuisines/21").send({
      name: "tes edit 21",
      description: "tes edit 21",
      price: 2000,
      imgUrl: "tes edit",
      categoryId: 1,
      authorId: 2,
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .put("/cuisines/21")
      .send({
        name: "tes edit 21",
        description: "tes edit 21",
        price: 2000,
        imgUrl: "tes edit",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal karena id entity yang dikirm tidak terdapat di database", async () => {
    const response = await request(app)
      .put("/cuisines/25")
      .send({
        name: "tes edit 21",
        description: "tes edit 21",
        price: 2000,
        imgUrl: "tes edit",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });

  test("Gagal menjalankan fitur ketika Staff mengolah data Cuisine yang bukan miliknya", async () => {
    response = await request(app)
      .put("/cuisines/1")
      .send({
        name: "tes edit 1",
        description: "tes edit 1",
        price: 2000,
        imgUrl: "tes edit",
        categoryId: 1,
        authorId: 1,
      })
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Forbidden access");
  });

  test("Gagal ketika request body yang diberikan tidak sesuai", async () => {
    const response = await request(app)
      .put("/cuisines/21")
      .send({
        name: "tes edit 21",
        description: "",
        price: 2000,
        imgUrl: "tes edit",
        categoryId: 1,
        authorId: 2,
      })
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "description is required");
  });
});

describe("Delete, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil menghapus data Cuisine berdasarkan params id yang diberikan", async () => {
    const response = await request(app)
      .delete("/cuisines/5")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 5);
    expect(response.body).toHaveProperty("name", "Cuisine 5");
    expect(response.body).toHaveProperty(
      "description",
      "Description cuisine 5"
    );
    expect(response.body).toHaveProperty("price", 5000);
    expect(response.body).toHaveProperty(
      "imgUrl",
      "https://www.marugameudon.co.id/omni-media/thumb/product_photo/2023/10/16/hia2rn8frordec5ntug6em_size_400_webp.webp"
    );
    expect(response.body).toHaveProperty("categoryId", 1);
    expect(response.body).toHaveProperty("authorId", 1);
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).delete("/cuisines/21");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .delete("/cuisines/21")
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal karena id entity yang dikirm tidak terdapat di database", async () => {
    const response = await request(app)
      .delete("/cuisines/25")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });

  test("Gagal menjalankan fitur ketika Staff menghapus entity yang bukan miliknya", async () => {
    response = await request(app)
      .delete("/cuisines/1")
      .set("Authorization", `Bearer ${access_token_staff}`);

    expect(response.status).toBe(403);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Forbidden access");
  });
});

describe("Endpoint List pada public site, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil mendapatkan Cuisine tanpa menggunakan query filter parameter", async () => {
    const response = await request(app).get("/pub/cuisines/");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("page", 1);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(10);
    expect(response.body.data[0]).toHaveProperty("id", 1);
    expect(response.body.data[0]).toHaveProperty("name", "Cuisine 1");
    expect(response.body.data[0]).toHaveProperty(
      "description",
      "Description cuisine 1"
    );
    expect(response.body.data[0]).toHaveProperty("price", 5000);
    expect(response.body.data[0]).toHaveProperty("categoryId", 1);
    expect(response.body.data[0]).toHaveProperty("authorId", 1);
    expect(response.body.data[0]).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty("User");
    expect(response.body.data[0].User).toHaveProperty("id", 1);
    expect(response.body.data[0].User).toHaveProperty("username", "tesAdmin");
    expect(response.body.data[0].User).toHaveProperty(
      "email",
      "tesadmin@mail.com"
    );
    expect(response.body.data[0].User).toHaveProperty("role", "Admin");
    expect(response.body.data[0].User).toHaveProperty(
      "phoneNumber",
      "08111111"
    );
    expect(response.body.data[0].User).toHaveProperty(
      "address",
      "user 1 address"
    );
    expect(response.body.data[0].User).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0].User).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );

    expect(response.body).toHaveProperty("totalData", 21);
    expect(response.body).toHaveProperty("totalPage", 3);
  });
  test("Berhasil mendapatkan Cuisine dengan 1 query filter parameter", async () => {
    const response = await request(app).get("/pub/cuisines?filterCategory=3");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("page", 1);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(5);
    expect(response.body.data[0]).toHaveProperty("id", 11);
    expect(response.body.data[0]).toHaveProperty("name", "Cuisine 11");
    expect(response.body.data[0]).toHaveProperty(
      "description",
      "Description cuisine 11"
    );
    expect(response.body.data[0]).toHaveProperty("price", 5000);
    expect(response.body.data[0]).toHaveProperty("categoryId", 3);
    expect(response.body.data[0]).toHaveProperty("authorId", 1);
    expect(response.body.data[0]).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty("User");
    expect(response.body.data[0].User).toHaveProperty("id", 1);
    expect(response.body.data[0].User).toHaveProperty("username", "tesAdmin");
    expect(response.body.data[0].User).toHaveProperty(
      "email",
      "tesadmin@mail.com"
    );
    expect(response.body.data[0].User).toHaveProperty("role", "Admin");
    expect(response.body.data[0].User).toHaveProperty(
      "phoneNumber",
      "08111111"
    );
    expect(response.body.data[0].User).toHaveProperty(
      "address",
      "user 1 address"
    );
    expect(response.body.data[0].User).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0].User).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );

    expect(response.body).toHaveProperty("totalData", 5);
    expect(response.body).toHaveProperty("totalPage", 1);
  });
  test("Berhasil mendapatkan Cuisine dengan 1 query filter parameter", async () => {
    const response = await request(app).get("/pub/cuisines?page=3");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("page", 3);

    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0]).toHaveProperty("id", 21);
    expect(response.body.data[0]).toHaveProperty("name", "Cuisine 21");
    expect(response.body.data[0]).toHaveProperty(
      "description",
      "Description cuisine 21"
    );
    expect(response.body.data[0]).toHaveProperty("price", 5000);
    expect(response.body.data[0]).toHaveProperty("categoryId", 4);
    expect(response.body.data[0]).toHaveProperty("authorId", 2);
    expect(response.body.data[0]).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty("User");
    expect(response.body.data[0].User).toHaveProperty("id", 2);
    expect(response.body.data[0].User).toHaveProperty("username", "tesStaff");
    expect(response.body.data[0].User).toHaveProperty(
      "email",
      "tesstaff@mail.com"
    );
    expect(response.body.data[0].User).toHaveProperty("role", "Staff");
    expect(response.body.data[0].User).toHaveProperty(
      "phoneNumber",
      "08111111"
    );
    expect(response.body.data[0].User).toHaveProperty(
      "address",
      "user 2 address"
    );
    expect(response.body.data[0].User).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0].User).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );

    expect(response.body).toHaveProperty("totalData", 21);
    expect(response.body).toHaveProperty("totalPage", 3);
  });
});

describe("Endpoint Detail pada public site, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil mendapatkan 1 Cuisine sesuai dengan params id yang diberikan", async () => {
    const response = await request(app).get("/pub/cuisines/1");

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name", "Cuisine 1");
    expect(response.body).toHaveProperty(
      "description",
      "Description cuisine 1"
    );
    expect(response.body).toHaveProperty("price", 5000);
    expect(response.body).toHaveProperty(
      "imgUrl",
      "https://www.marugameudon.co.id/omni-media/thumb/product_photo/2023/10/16/hia2rn8frordec5ntug6em_size_400_webp.webp"
    );
    expect(response.body).toHaveProperty("categoryId", 1);
    expect(response.body).toHaveProperty("authorId", 1);
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
  });

  test("Gagal mendapatkan Cuisine karena params id yang diberikan tidak ada di database / invalid", async () => {
    const response = await request(app)
      .get("/cuisines/25")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });
});
