import type { NextApiRequest, NextApiResponse } from 'next';
import { getRedisClient } from '../../../utils/redis';

type NoteFetchError = {
  error: string;
};

export default (
  req: NextApiRequest,
  res: NextApiResponse<string | NoteFetchError>
): void => {
  const client = getRedisClient();
  client.get(req.query.id as string, (err, note) => {
    if (err) {
      res.statusCode = 500;
      return res.end();
    }
    if (!note) {
      res.statusCode = 404;
      return res.end();
    }
    if (isJson(note)) {
      res.statusCode = 200;
      res.json(note);
    } else {
      res.writeHead(200, { 'Content-Type': 'text/plain;charset=UTF-8' });
      res.write(note);
      res.end();
    }
  });
};

const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
