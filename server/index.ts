import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import app from './app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

// Serve frontend dist if built (for local production mode)
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(expressStatic(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

function expressStatic(dir: string) {
  // express static middleware
  return (req: any, res: any, next: any) => {
    const filePath = path.join(dir, req.path);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return res.sendFile(filePath);
    }
    next();
  };
}

app.listen(PORT, () => {
  console.log(`[KalaSetu API] Server running on http://localhost:${PORT}`);
  console.log(`[KalaSetu API] AI-Driven Market Linkage & Smart Cataloging Ready`);
});
