import { Button, Card, Col, Form, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setFoFaApiKey } from '../../../data/userConfigDataSlice';

function FoFaConfig() {
  const { fofaApiKey, fofaUri } = useSelector((state) => state.userConfigData);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(setFoFaApiKey(values.fofaApiKey));
      await window.electron.ipcRenderer.invoke('setConfig', 'fofaConfig', {
        fofaApiKey: values.fofaApiKey,
        fofaUri: values.fofaApiUri
      });
      message.success('配置保存成功');
    } catch (e) {
      message.warning('配置保存出错' + e);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Card title="FoFa配置">
      <Form
        name="basic"
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 16
        }}
        style={{
          maxWidth: 500
        }}
        initialValues={{
          fofaApiUri: fofaUri,
          fofaApiKey: fofaApiKey
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="fofaApi地址"
          name="fofaApiUri"
          rules={[
            {
              required: true,
              message: '请输入fofaApi地址!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="fofaApiKey"
          name="fofaApiKey"
          rules={[
            {
              required: true,
              message: '请输入FoFaApiKey!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16
          }}
        >
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default FoFaConfig;
