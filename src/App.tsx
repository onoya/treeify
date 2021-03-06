import { load, YAMLException } from 'js-yaml';
import { useEffect, useState } from 'react';
import treeify, { TreeObject } from 'treeify';
import styles from './App.module.css';
import YamlEditor from './YamlEditor';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-one_dark';
import swal from 'sweetalert';

const defaultData = `hello:
  world:
john:
doe:
`;

const SANBOX_HISTORY_KEY = 'sandbox-history';
const LAST_WORKING_TREE_KEY = 'last-working-tree';

function App() {
  const [yml, setYml] = useState(
    () => localStorage.getItem(SANBOX_HISTORY_KEY) ?? defaultData
  );
  const [tree, setTree] = useState(
    () => localStorage.getItem(LAST_WORKING_TREE_KEY) ?? ''
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const treeObj = load(yml) as TreeObject;
      const treeString = treeify.asTree(treeObj, false, true);
      setTree(treeString);
      localStorage.setItem(LAST_WORKING_TREE_KEY, treeString);
      setError(null);
    } catch (err) {
      if (err instanceof YAMLException) {
        setError(`Invalid yaml format`);
      } else {
        setError('Something went wrong');
      }
      console.error(err);
    }
  }, [yml]);

  const handleChange = (value: string) => {
    setYml(value);
    localStorage.setItem(SANBOX_HISTORY_KEY, value);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(tree);
    swal({
      text: 'Successfully copied to clipboard!',
      icon: 'success',
    });
  };

  return (
    <main>
      <h1 className={styles.title}>TREEIFY</h1>

      <div className={styles.container}>
        <div>
          <h3>YAML</h3>
          <YamlEditor value={yml} onChange={handleChange} />
        </div>
        {error && <span className={styles.error}>{error}</span>}

        <div className={styles.result}>
          <div className={styles.header}>
            <h3>Result</h3>

            <button onClick={handleCopyToClipboard} className={styles.copy}>
              Copy
            </button>
          </div>

          <pre>{tree}</pre>
        </div>
      </div>
    </main>
  );
}

export default App;
