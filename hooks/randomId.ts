import { useEffect, useState } from 'react';
import shortid from 'shortid';

const useRandomId = (): string => {
  const [id, setId] = useState('');
  useEffect(() => {
    setId(shortid.generate());
  }, []);

  return id;
};

export default useRandomId;
