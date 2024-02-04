import {Layout} from '@layerzerolabs/ui-kit';

import {AptosBridge} from '../components/AptosBridge';
import {AppFooter, AppHeader} from '../components/Layout';

const Bridge = () => {
  return (
    <Layout header={<AppHeader />} footer={<AppFooter />}>
      <AptosBridge />
    </Layout>
  );
};

export default Bridge;
