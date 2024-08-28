import { Row, Col } from 'antd';

import FoFaConfig from './component/FoFaConfig';
import BruteConfig from './component/BruteConfig.jsx';

const UserConfig = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={12}>
          <FoFaConfig />
        </Col>
        <Col span={12}>
          <BruteConfig />
        </Col>
      </Row>
    </>
  );
};

export default UserConfig;
