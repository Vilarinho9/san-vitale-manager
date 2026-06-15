require('dotenv').config()
const express = require('express')
const cors = require('cors')

const clientesRoutes = require('./routes/clientes.routes')
const servicosRoutes = require('./routes/servicos.routes')
const agendamentosRoutes = require('./routes/agendamentos.routes')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    sistema: 'San Vitale Manager API',
    versao: '1.0.0',
    timestamp: new Date().toISOString()
  })
})

// Routes
app.use('/clientes', clientesRoutes)
app.use('/servicos', servicosRoutes)
app.use('/agendamentos', agendamentosRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erro interno do servidor.' })
})

app.listen(PORT, () => {
  console.log(`\n✅ San Vitale Manager API rodando na porta ${PORT}`)
  console.log(`   http://localhost:${PORT}\n`)
})