import express, { Request, Response } from 'express';

const app = express();
const port = 3002;

app.use(express.json());

const data = [
  { id: 1, name: 'Item 1', value: 10 },
  { id: 2, name: 'Item 2', value: 20 },
  { id: 3, name: 'Item 3', value: 30 },
  { id: 4, name: 'Item 4', value: 40 }

];

app.get('/data', (req: Request, res: Response) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});