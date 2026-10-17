import React, { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Input = styled.textarea`
  display: block;
  box-sizing: border-box;
  width: 100%;
  min-height: 10rem;
  margin: 0.5rem 0;
  font: inherit;
  resize: vertical;
`;

type Props = { onImport: (markdown: string) => Promise<void> };

const MarkdownInput = ({ onImport }: Props) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    [],
  );

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setMessage("Importing Markdown…");
    try {
      await onImport(value);
      if (mounted.current)
        setMessage("Markdown imported. The editor and preview have been updated.");
    } catch (error) {
      if (mounted.current)
        setMessage(
          error instanceof Error ? error.message : "Markdown could not be imported. Please retry.",
        );
    } finally {
      if (mounted.current) setLoading(false);
    }
  };

  return (
    <>
      <details>
        <summary>Import Markdown</summary>
        <form onSubmit={submit}>
          <label htmlFor="markdown-input">Markdown input</label>
          <p id="markdown-help">
            Importing replaces the current editor content. Empty input clears it. Headings 4–6
            become heading 3; unsupported Markdown stays as plain text.
          </p>
          <Input
            id="markdown-input"
            aria-describedby="markdown-help"
            value={value}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              setValue(event.target.value);
              setMessage("");
            }}
            readOnly={loading}
          />
          <button type="submit" aria-disabled={loading}>
            Replace editor content
          </button>
        </form>
      </details>
      <p role="status">{message}</p>
    </>
  );
};

export default MarkdownInput;
