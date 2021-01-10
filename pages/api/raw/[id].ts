import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/mongodb';

type NoteFetchError = {
  error: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<string | NoteFetchError>
): Promise<void> => {
  try {
    const { db } = await connectToDatabase();
    const note = await db.collection('notes').findOne({
      _id: req.query.id,
    });
    if (isJson(note.content)) {
      res.statusCode = 200;
      res.json(note.content);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF-8' });
      res.write(note.content);
      res.end();
    }
  } catch (err) {
    res.statusCode = 500;
    res.json({
      error: err.code,
    });
  }
};

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
