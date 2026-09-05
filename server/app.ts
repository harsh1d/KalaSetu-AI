import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products';
import aiRouter from './routes/ai';
import artisansRouter from './routes/artisans';
import ordersRouter from './routes/orders';
import analyticsRouter from './routes/analytics';

export const app = express();

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

export default app;
