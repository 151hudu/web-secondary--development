import React from "react";
import {
  DataConfiguration,
  StyleConfiguration,
  OtherConfiguration,
  Main
} from "./components";
import PropTypes from "prop-types";

const renderHashMap = {
  Main: Main,
  dataConfiguration: DataConfiguration,
  styleConfiguration: StyleConfiguration,
  otherConfiguration: OtherConfiguration
};
const App = ({ type, mode, ...props }) => {
  if (mode === "development") {
    return (
      <Main {...props}></Main>
      // <>
      //   <div id={"main"}>
      //     <div className="left">主视图</div>
      //     <div className="right" style={{ width: "80%", height: "400px" }}>
      //       <Main {...props}></Main>
      //     </div>
      //   </div>
      //   <div id={"style"}>
      //     <div className="left">style</div>
      //     <div className="right">
      //       <StyleConfiguration {...props}></StyleConfiguration>
      //     </div>
      //   </div>
      //   <div id={"data"}>
      //     <div className="left">data</div>
      //     <div className="right">
      //       <DataConfiguration {...props}></DataConfiguration>
      //     </div>
      //   </div>
      //   <div id={"other"}>
      //     <div className="left">other</div>
      //     <div className="right">
      //       <OtherConfiguration {...props}></OtherConfiguration>
      //     </div>
      //   </div>
      // </>
    );
  } else {
    let handleConfiguration = () => {
      const dataConfig = props.block?.dataConfig || {};
      const { pluginOptions = {}, columns } = dataConfig;
      pluginOptions.columns = columns;
      return pluginOptions;
    };
    let changeConfiguration = (pluginOptions) => {
      if (props.bigscreen && props.block) {
        const {
          bigscreen: { updateBlockById, pluginDetailMap },
          block: {
            baseConfig: { id }
          }
        } = props;
        updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
        pluginDetailMap[`${id}-default`].detail.ref.current.run();
      } else {
        console.log("暂时无此方法，请升级版本");
      }
    };
    props = { configuration: handleConfiguration(), ...props };
    const options = {
      changeConfiguration,
      ...props
    };
    if (!type) {
      return (<Main {...props}></Main>);
    } else {
      let Comp = () => <></>;
      if (renderHashMap[type]) Comp = renderHashMap[type];
      return <Comp {...options} />;
    }
  }
};


App.propTypes = {
  type: PropTypes.string
};

export default App;
