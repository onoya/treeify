import { load, YAMLException } from 'js-yaml';
import {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from 'react';
import treeify, { TreeObject } from 'treeify';

const defaultData = `hello:
  world:
john:
doe:`;

const TAB_SIZE = 2;

function App() {
  const [yml, setYml] = useState(defaultData);
  const [tree, setTree] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const treeObj = load(yml) as TreeObject;
      setTree(treeify.asTree(treeObj, false, true));
      setError(null);
    } catch (err) {
      if (err instanceof YAMLException) {
        setError(`Invalid yaml format: ${err.reason}`);
      } else {
        setError('Something went wrong');
        console.error(err);
      }
    }
  }, [yml]);

  const handleTextChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setYml(e.target.value);
  };

  const handleCopyToClipboard = () => navigator.clipboard.writeText(tree);

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      const { selectionStart, selectionEnd } = e.currentTarget;

      const tabString = ' '.repeat(TAB_SIZE);

      setYml(
        (prev) =>
          prev.substring(0, selectionStart) +
          tabString +
          prev.substring(selectionEnd)
      );
    }
  };

  return (
    <main>
      <textarea
        onChange={handleTextChange}
        value={yml}
        onKeyDown={handleKeyDown}
        cols={50}
        rows={10}
      />

      {error && <span>{error}</span>}

      <div>
        <button onClick={handleCopyToClipboard}>Copy</button>

        <pre>{tree}</pre>
      </div>
    </main>
  );
}

export default App;
