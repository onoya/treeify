import Editor from 'react-ace';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const YamlEditor = ({ value, onChange }: Props) => {
  return (
    <Editor
      mode="yaml"
      theme="one_dark"
      tabSize={2}
      showPrintMargin={false}
      width="100%"
      showGutter={false}
      value={value}
      onChange={onChange}
      editorProps={{ $blockScrolling: true }}
    />
  );
};
export default YamlEditor;
