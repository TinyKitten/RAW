import React, { useCallback, useState } from 'react';
import fetch from 'unfetch';
import useRandomId from '../hooks/randomId';
import { NoteBody } from '../models/NoteBody';

export default function Home(): React.ReactElement {
  const id = useRandomId();
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
        body: JSON.stringify({ id, content } as NoteBody),
      });
      if (result.ok) {
        setHasError(false);
        setWrote(true);
      } else {
        setHasError(true);
      }
    },
    [content, id]
  );

  return (
    <div>
      {wrote && (
        <p style={{ fontWeight: 'bold' }}>
          Your Path:{' '}
          <a target="_blank" rel="noreferrer" href={`/api/raw/${id}`}>
            /api/raw/{id}
          </a>
        </p>
      )}
      {hasError && (
        <p style={{ fontWeight: 'bold', color: 'crimson' }}>
          An error occurred!
        </p>
      )}
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
