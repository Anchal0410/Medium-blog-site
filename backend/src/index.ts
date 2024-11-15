import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign} from 'hono/jwt'
// import dotenv from 'dotenv';

// dotenv.config();

const prisma = new PrismaClient({
    datasourceUrl: env.DATABASE_URL,
}).$extends(withAccelerate())

const app = new Hono()

app.get('/users', async(c) => {
  const prisma = new PrismaClient({
      datasourceUrl: "postgresql://neondb_owner:N8DYvhp1mUcd@ep-soft-salad-a5u37rz6.us-east-2.aws.neon.tech/neondb?sslmode=require",
  }).$extends(withAccelerate())
  
  const body = await c.req.json();
  const user = await prisma.user.create({
    data:{
      email:body.email,
      password: body.password
    }
  })
  const jwt = await sign({id:user.id},"secret");
  return c.json({jwt});
})
app.post('/api/v1/user/signup',async (c)=>{
  const prisma = new PrismaClient({

    datasourceUrl: env.DATABASE_URL1,
  }).$extends(withAccelerate())
  
  const body = await c.req.json();
  try {
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: body.password
    }
  });
  
  const jwt = await sign({ id: user.id }, env.JWT_SECRET as string);
  return c.json({ jwt });
} catch(e) {
  c.status(403);
  console.log(e);
}
})
app.post('/api/v1/user/signin',(c)=>{
  return c.text("Hello Hono!")
})
app.post('/api/v1/blog',(c)=>{
  return c.text("Hello Hono!")
})
app.put('/api/v1/blog',(c)=>{
  return c.text("Hello Hono!")
})
app.get('/api/v1/blog/:id',(c)=>{
  return c.text("Hello Hono!")
})
app.get('/api/v1/blog/bulk',(c)=>{
  return c.text("Hello Hono!")
})

export default app
