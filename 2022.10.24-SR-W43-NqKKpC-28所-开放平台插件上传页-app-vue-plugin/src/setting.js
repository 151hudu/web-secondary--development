import React, { useState } from 'react';
import { Button, Input, Radio, message } from "antd";
import "./app.less";

const style = `{"width":"100%","height":"40px","textAlign":"center"}`;

const Setting = props => {
    const { funcRef, onConfigChange } = props;
    
    const [customConfig, setCustomConfig] = useState(props.customConfig || {});
    const [type, setType] = useState('appPage');

    const { btnName, btnStyle, assetInfo, linkedInfo } = customConfig;

    const changeName = e => {
        let config = { ...customConfig };
        if (e.target.value) {
            config.btnName = e.target.value;
            setCustomConfig(config);
            onConfigChange && onConfigChange(config);
        } else {
            message.warn('按钮名称不能为空');
        }
    };

    const changeStyle = e => {
        let config = { ...customConfig };
        config.btnStyle = e.target.value;
        setCustomConfig(config);
        onConfigChange && onConfigChange(config);
    };

    const changeType = e => {
        let config = { ...customConfig };
        config.linkedInfo = undefined;
        setType(e.target.value);
        onConfigChange && onConfigChange(config);
    }

    const onChooseAsset = () => {
        funcRef?.showAssetModal && funcRef.showAssetModal({
            assetType: undefined, // 资产类型
            filterType: 38, // 过滤类型
        }, setCustomConfig);
    };

    const onChoosePage = () => {
        funcRef?.showLinkedModal && funcRef.showLinkedModal({
            selectType: type === 'appPage' ? type : undefined,
            listType: type !== 'appPage' ? [type] : undefined,
        }, setCustomConfig);
    }

    return (
        <>
            <div className="custom-config-title">
                按钮名称
            </div>
            <div className="custom-config-line">
                <Input
                    style={{ with: '100%' }}
                    defaultValue={btnName || '自定义按钮'}
                    onChange={changeName}
                />
            </div>
            <div className="custom-config-title">
                按钮样式
            </div>
            <div className="custom-config-line">
                <Input.TextArea
                    style={{ with: '100%' }}
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    defaultValue={btnStyle || style}
                    onChange={changeStyle}
                />
            </div>
            <div className="custom-config-title">
                选择资产
            </div>
            {assetInfo && (
                <div className="custom-config-value">
                    {`已选中 ${assetInfo?.asset_name || '一个资产'}`}
                </div>
            )}
            <div className="custom-config-line">
                <Button
                    type="primary"
                    className="custom-config-btn"
                    onClick={onChooseAsset}
                >
                    选择资产
                </Button>
            </div>
            <div className="custom-config-title">
                选择页面/表单
            </div>
            <div className="custom-config-line-mult">
                <Radio.Group
                    className="custom-config-group"
                    defaultValue={type}
                    onChange={changeType}
                >
                    <Radio value="appPage">应用页面</Radio>
                    <Radio value="data-form-design">表单</Radio>
                    <Radio value="data-form-detail">详情</Radio>
                    <Radio value="data-form-list">列表</Radio>
                </Radio.Group>
                {linkedInfo && (
                    <div className="custom-config-value">
                        {`已选中 ${linkedInfo?.name || '页面/表单'}`}
                    </div>
                )}
                <Button
                    type="primary"
                    className="custom-config-btn"
                    onClick={onChoosePage}
                >
                    选择页面/表单
                </Button>
            </div>
        </>
    );
};

export default Setting;
