import { Button } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import React from 'react';

export default function FileSelector(props) {
  return (
    <>
      <div className={props.className}>
        <input
          type="file"
          style={{ display: 'none' }}
          className={props.fileClassName}
        />
        <Button icon={<FileOutlined />} onClick={props.onClick}>
          {props.currentName}
        </Button>
      </div>
    </>
  );
}
