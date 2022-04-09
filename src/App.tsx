import { load, YAMLException } from 'js-yaml';
import { useEffect, useState } from 'react';
import AceEditor from 'react-ace';
import treeify, { TreeObject } from 'treeify';

import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/theme-github';

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
      <AceEditor
        mode="yaml"
        theme="github"
        tabSize={2}
        showPrintMargin={false}
        showGutter={false}
        value={yml}
        onChange={setYml}
        editorProps={{ $blockScrolling: true }}
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
