import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.get("/users", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password,
    },
  });
  const jwt = await sign({ id: user.id }, "secret");
  return c.json({ jwt });
});

// Signup 
app.post("/api/v1/user/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET as string);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    console.log(e);
  }
});

// app.post("/api/v1/user/signin", (c) => {
//   return c.text("Hello Hono!");
// });
// app.post("/api/v1/blog", (c) => {
//   return c.text("Hello Hono!");
// });
// app.put("/api/v1/blog", (c) => {
//   return c.text("Hello Hono!");
// });
// app.get("/api/v1/blog/:id", (c) => {
//   return c.text("Hello Hono!");
// });
// app.get("/api/v1/blog/bulk", (c) => {
//   return c.text("Hello Hono!");
// });

app.get("/", (c) => {
  return c.text("Hello Rajan");
});

export default app;
