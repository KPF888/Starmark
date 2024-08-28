import { Button, Card, Col, Form, message, Row, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import FileSelector from '../../../component/FileSelector.jsx';
import React, { useState } from 'react';
import FileUtil from '../../../util/FileUtil.js';
import { setDictPath } from '../../../data/subDomainDataSlice.js';

const { ipcRenderer } = electron;

export default function BruteConfig() {
  const { dictPath } = useSelector((state) => state.subDomainData);
  const [filePath, setFilePath] = useState(null);
  const dispatch = useDispatch();

  const onFinish = async () => {
    try {
      console.log(filePath);
      if (!filePath) {
        message.info('未修改,无需保存');
        return;
      }
      dispatch(setDictPath(filePath));
      await ipcRenderer.invoke('setConfig', 'dictPath', filePath);
      message.success('配置保存成功');
    } catch (e) {
      message.warning('配置保存出错' + e.message);
    }
  };

  async function fileHandleClick() {
    const fileUtil = new FileUtil('.dict-file-input');
    await fileUtil.build();
    try {
      const filePath = await fileUtil.getFilePath();
      setFilePath(filePath);
    } catch (e) {
      message.warning(e);
    }
  }

  return (
    <Card title="子域名爆破字典配置">
      <Row>文件路径: {filePath || dictPath || './config/subdomain.txt'}</Row>
      <Row className={'mt-5'}>
        <Space>
          <FileSelector
            fileClassName={'dict-file-input'}
            onClick={fileHandleClick}
            currentName={'选择文件'}
          />
          <Button onClick={onFinish} type="primary" htmlType="submit">
            保存
          </Button>
        </Space>
      </Row>
    </Card>
  );
}
