import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import productsRouter from './routes/products';
import aiRouter from './routes/ai';
import artisansRouter from './routes/artisans';
import ordersRouter from './routes/orders';
import analyticsRouter from './routes/analytics';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/ai', aiRouter);
app.use('/api/artisans', artisansRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/analytics', analyticsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'KalaSetu AI Enterprise API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    topic: 'SIH26090 - AI-Driven Market Linkage & Smart Cataloging for Marginalized Artisans'
  });
});

// Serve frontend dist if built
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}


app.listen(PORT, () => {
  console.log(`[KalaSetu API] Server running on http://localhost:${PORT}`);
  console.log(`[KalaSetu API] AI-Driven Market Linkage & Smart Cataloging Ready`);
});
