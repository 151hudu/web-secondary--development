import {
  Button,
  Input,
  Form
} from "antd"

const Options = (props) => {
  const optionsRender = process.env.CUSTOM_PLUGIN.props.customconf || []
  let { options, changeOptions } = props
  const handleValueChange = (currentValue, allValues) => {
    options = {...options,...allValues}
  }
  const optionsSubmit = () => {
    changeOptions(options)
  }
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }
  return (
    <>
      <Form
        {...formItemLayout}
        initialValues={options}
        onValuesChange={handleValueChange}
      >
        {
          optionsRender.map((item) => {
            return (<Form.Item label={item} name={item} key={item}>
              <Input />
            </Form.Item>)
          })
        }
      </Form>
      <Button className="optionsSubmit" onClick={optionsSubmit}>执行</Button>
    </>
  )
}
export default Options