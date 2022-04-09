import { load, YAMLException } from 'js-yaml';
import { useEffect, useState } from 'react';
import treeify, { TreeObject } from 'treeify';
import styles from './App.module.css';
import YamlEditor from './YamlEditor';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-one_dark';

const defaultData = `hello:
  world:
john:
doe:
`;

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

  const handleCopyToClipboard = () => navigator.clipboard.writeText(tree);

  return (
    <main>
      <h1 className={styles.title}>TREEIFY</h1>

      <div className={styles.container}>
        <YamlEditor value={yml} onChange={setYml} />
        {error && <span className={styles.error}>{error}</span>}

        <div className={styles.result}>
          <button onClick={handleCopyToClipboard}>Copy</button>

          <pre>{tree}</pre>
        </div>
      </div>
    </main>
  );
}

export default App;
