import React, { Component } from "react";
import DesignConfiguration from "./components/designConfiguration";
import { getAssetData } from "./api/asset";

import "./app.css";

const renderHashMap = {
  dataConfigration: DesignConfiguration,
};
export default class App extends Component {
  state = {
    id: this.props.block?.baseConfig.id || "1",
    selectKey: '',
    fontColorConfig: "",
    fontSizeConfig: '',
    lineHeightConfig: '',
    fontFamilyConfig: '',
    assetId: '',
    textList: []
  };

  componentDidMount() {
    const { type } = this.props;
    console.log('预览页', this.props);
    if (!renderHashMap[type]) {
      this.initComData();
      const {
        block: {
          dataConfig: {
            pluginOptions = {}
          }
        }
      } = this.props;
      const events = [
        // {
        //   key: "onClick",
        //   name: "点击",
        //   payload: [
        //     {
        //       name: "名称",
        //       dataType: "string",
        //       key: "name",
        //     },
        //   ],
        // },
      ];

      const actions = [
        // {
        //   key: "messageSuccess",
        //   name: "成功提示",
        //   params: [
        //     {
        //       key: "value",
        //       name: "值",
        //       dataType: "string",
        //     },
        //   ],
        // },
      ];

      window.componentCenter?.register &&
        window.componentCenter.register(this.props?.componentId, "comp", this, {
          events,
          actions,
        });
      this.props?.updateProcess && this.props.updateProcess();

      this.Event_Center_getName = () => {
        return "";
      };
    }
  }
  componentWillUnmount() {}

  //处理配置更新
  handleOptionsChange = (pluginOptions) => {
    const {
      bigscreen: { updateBlockById, pluginDetailMap },
      block: {
        baseConfig: { id }
      }
    } = this.props;
    const containerId = pluginOptions.containerId;
    // if (pluginOptions.containerId) {
    //   updateBlockById(containerId, {
    //     dataConfig: {
    //       configs: [
    //         {
    //           name: "网页",
    //           type: 0,
    //           value: pluginOptions.tabLink1
    //         }
    //       ],
    //       defaultValue: null,
    //       defaultType: 3
    //     }
    //   });
    // }
    updateBlockById(id, { dataConfig: { pluginOptions: { ...pluginOptions } } });
    //调用加载器的run方法强制更新
    pluginDetailMap[`${id}-default`].detail.ref.current.run();
    // console.log('containerId/id', containerId, id);
    // console.log('pluginOptions', pluginOptions);
  };

  //处理需要的变量
  handleConfiguration = () => {
    const { block } = this.props;
    const { dataConfig } = block;
    const { pluginOptions = {}, columns } = dataConfig;
    pluginOptions.columns = columns;
    // const { pluginOptions = {} } = dataConfig;
    return pluginOptions;
  };

  //加载配置数据
  initComData = async () => {
    let wordKey = ""
    const {
      block: {
        dataConfig: {
          pluginOptions = {}
        }
      }
    } = this.props;
    if (pluginOptions?.fontColorConfig) {
      this.setState({
        fontColorConfig: pluginOptions.fontColorConfig
      });
    }
    if (pluginOptions?.fontSizeConfig) {
      this.setState({
        fontSizeConfig: pluginOptions.fontSizeConfig
      });
    }
    if (pluginOptions?.lineHeightConfig) {
      this.setState({
        lineHeightConfig: pluginOptions.lineHeightConfig
      });
    }
    if (pluginOptions?.fontFamilyConfig) {
      this.setState({
        fontFamilyConfig: pluginOptions.fontFamilyConfig
      });
    }
    if (pluginOptions?.selectKey) {
      wordKey = pluginOptions.selectKey;
      this.setState({
        selectKey: pluginOptions.selectKey
      });
    }
    // if (pluginOptions?.assetId) {
    //   this.setState({
    //     assetId: pluginOptions.assetId
    //   });
    //   let { data } = await getAssetData(pluginOptions.assetId)
    //   let key = data[0]
    //   let val = data[1]
    //   let dataCopy = []
    //   val.forEach(element => {
    //     key.forEach((x,y)=>{
    //       if (x.col_name == wordKey){
    //         dataCopy = dataCopy.concat(JSON.parse(element[y])) 
    //       }
    //     })
    //   });
    //   this.setState({ textList: dataCopy })
    //   console.log('dataCopy', dataCopy);
    // }
    let dataList = this.props.block.dataConfig.data || [["常用", "[\"2022-10-01 数睿1\",\"2022-10-02 数睿2\",\"2022-10-03 数睿3\"]"], ["常用", "[\"2022-11-01 数睿4\",\"2022-12-02 数睿5\",\"2023-01-03 数睿6\"]"]];
    let columns = this.props.block.dataConfig.columns || ["title", "content"];
    let dataCopy = []
    dataList.forEach((element, index) => {
      element.forEach((x,y)=>{
        if (columns[y] === wordKey) {
          dataCopy = dataCopy.concat(JSON.parse(x))
        }
      })
    });
    this.setState({ textList: dataCopy })
    console.log('dataCopy', dataCopy);
  };

  render() {
    const { type } = this.props;
    if (renderHashMap[type]) {
      const options = {
        changeConfiguration: this.handleOptionsChange,
        configuration: this.handleConfiguration(),
        ...this.props
      };
      const Comp = renderHashMap[type];
      return (<Comp {...options}></Comp>);
    } else {
      const { textList, fontColorConfig, fontSizeConfig, lineHeightConfig, fontFamilyConfig } = this.state;
      return (
        <>
          <div className="textList" style={{ width: '100%', height: '100%' }}>
            {
              textList.map(( item, index )=>{
                return <div className="textRow" key={index} style={{ fontSize: fontSizeConfig, color: fontColorConfig , lineHeight: lineHeightConfig, fontFamily: fontFamilyConfig}}>{item}</div>
              })
            }
          </div>
        </>
      );
    }
  }
}
