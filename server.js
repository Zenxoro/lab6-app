import express from 'express';
import pg from 'pg';

const app = express();
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
});

await pool.query(
  'CREATE TABLE IF NOT EXISTS visits (id SERIAL PRIMARY KEY, ts TIMESTAMPTZ DEFAULT now())'
);

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/health', (req, res) => res.send('ok'));

app.get('/api/visits', async (req, res) => {
  await pool.query('INSERT INTO visits DEFAULT VALUES');
  const r = await pool.query('SELECT count(*) FROM visits');
  res.json({ visits: Number(r.rows[0].count) });
});

app.listen(process.env.PORT || 3000, () => console.log('Server started'));
