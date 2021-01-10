import { Db } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../utils/mongodb';

export type NoteBody = {
  _id: string;
  content: string;
};
type NoteCreateError = {
  error: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<NoteCreateError>
): Promise<void> => {
  if (req.method === 'POST') {
    try {
      const { db } = await connectToDatabase();
      const reqJson = JSON.parse(req.body);
      const existsDoc = await db.collection('notes').findOne({
        _id: reqJson._id,
      });
      if (existsDoc) {
        await updateNoteAsync(reqJson, db);
        res.statusCode = 200;
      } else {
        await insertNoteAsync(reqJson, db);
        res.statusCode = 201;
      }
      return res.end();
    } catch (err) {
      res.statusCode = 500;
      return res.json({
        error: err,
      });
    }
  }
  res.statusCode = 201;
  return res.end();
};

const insertNoteAsync = async (body: NoteBody, db: Db) => {
  return new Promise((resolve, reject) => {
    return db.collection('notes').insertOne(body, (err) => {
      if (err) {
        return reject(err.code);
      }
      return resolve({});
    });
  });
};

const updateNoteAsync = async (body: NoteBody, db: Db) => {
  return new Promise((resolve, reject) => {
    return db.collection('notes').updateOne(
      {
        _id: body._id,
      },
      {
        $set: body,
      },
      (err) => {
        if (err) {
          return reject(err.code);
        }
        return resolve({});
      }
    );
  });
};
