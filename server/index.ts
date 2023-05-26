import express from 'express'
import path from 'path'
import cors from 'cors'

const app = express()

app.use(cors())

// "Retrieve static directory"
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.all('/api/*', (req, res) => {
  res.status(404).json({ code: -1, data: [], message: 'The current access API address does not exist' })
})

// "Render page"
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

// "Start server"
app.listen(3333, () => {
  console.log('Server is running on port 3333')
})
