import { PrismaClient } from '@prisma/client'
import express from 'express'

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

// GET all users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(users)
})

// GET all published posts
app.get('/feed', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true}
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(posts)
})

// GET a published post, include author
// NOTE: on line 28, had to replace .findOne with .findUnique
app.get(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.findUnique({
    where: {id: Number(id) },
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(post)
})

// CREATE new user in the database
app.post(`/user`, async (req, res) => {
  const result = await prisma.user.create({
    data: { ...req.body },
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(result)
})

// CREATE new post in the database
app.post(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await prisma.post.create({
    data: {
      title,
      content,
      published: false,
      author: { connect: { email: authorEmail } },
    },
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(result)
})

// EDIT a post to set published = true
app.put('/post/publish/:id', async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.update({
    where: { id: Number(id) },
    data: { published: true },
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(post)
})

// DELETE a post from the database
app.delete(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await prisma.post.delete({
    where: { id: Number(id) },
  })
  res.header("Access-Control-Allow-Origin", "http://localhost:5173")
  res.json(post)
})

app.listen(3000, () =>
  console.log('REST API server ready at: http://localhost:3000'),
)
