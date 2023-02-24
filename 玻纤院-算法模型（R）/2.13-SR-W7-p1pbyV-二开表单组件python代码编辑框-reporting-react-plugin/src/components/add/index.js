import React, { useEffect, useState } from "react";
import Editor from "react-monaco-editor";
import "./index.less";

const Add = (props) => {
  const { data, onChange, customConfig } = props;

  const [code, setCode] = useState("");

  useEffect(() => {
    console.log("配置项--->", customConfig);
    console.log("data--->", data);
    data && setCode(data);
  }, [data]);

  const changeEditor = (value) => {
    onChange(value);
  };

  const options = {
    readonly: true,
    theme: "vs-dark",
    // theme: "vs-light",
  };

  return (
    <div>
      <Editor
        width="100%"
        height={`${customConfig.editorHeight}px`}
        language="python"
        options={options}
        value={code}
        onChange={changeEditor}
      />
    </div>
  );
};

export default Add;
