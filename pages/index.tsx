import React, { useCallback, useState } from 'react';
import fetch from 'unfetch';
import { NoteBody } from './api/notes';
import useRandomId from '../hooks/randomId';

export default function Home(): React.ReactElement {
  const _id = useRandomId();
  const [content, setContent] = useState('');
  const [wrote, setWrote] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setContent(e.currentTarget.value);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!content.length) {
        return;
      }
      const result = await fetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ _id, content } as NoteBody),
      });
      if (result.ok) {
        setHasError(false);
        setWrote(true);
      } else {
        setHasError(true);
      }
    },
    [content, _id]
  );

  return (
    <div>
      {wrote && (
        <b>
          Your Path:{' '}
          <a target="_blank" rel="noreferrer" href={`/api/raw/${_id}`}>
            /api/raw/{_id}
          </a>
        </b>
      )}
      {hasError && <b style={{ color: 'crimson' }}>An error occurred!</b>}
      <form onSubmit={handleSubmit}>
        <textarea
          style={{ display: 'block' }}
          placeholder="Put here"
          onChange={handleContentChange}
        ></textarea>
        <input
          disabled={!content.length}
          style={{ display: 'block' }}
          type="submit"
          value="Submit"
        />
      </form>
      <p>
        Created by:{' '}
        <a
          style={{ color: '#008ffe' }}
          href="https://tinykitten.me/"
          target="_blank"
          rel="noreferrer"
        >
          TinyKitten
        </a>
      </p>
      <p>
        <a
          href="https://github.com/TinyKitten/RAW"
          target="_blank"
          rel="noreferrer"
        >
          Fork me on GitHub
        </a>
      </p>
    </div>
  );
}
