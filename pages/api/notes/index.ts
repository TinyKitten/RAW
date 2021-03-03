import type { NextApiRequest, NextApiResponse } from 'next';
import { NoteBody } from '../../../models/NoteBody';
import { getRedisClient } from '../../../utils/redis';

type NoteCreateError = {
  error: string;
};

export default (
  req: NextApiRequest,
  res: NextApiResponse<NoteCreateError>
): void => {
  if (req.method === 'POST') {
    const client = getRedisClient();
    const bodyJson = JSON.parse(req.body) as NoteBody;
    client.set(bodyJson.id, bodyJson.content, (err) => {
      if (err) {
        res.statusCode = 500;
        return res.end();
      }
    });
  }
  res.statusCode = 201;
  return res.end();
};
