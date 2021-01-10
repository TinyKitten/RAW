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
    res.statusCode = 200;
    if (isJson(note.content)) {
      res.json(note.content);
    } else {
      res.send(note.content);
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
