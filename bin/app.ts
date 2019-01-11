import ApigwVpcNlbStack from "./apigw_vpc_nlb";
import VpcStack from "./vpc";


import cdk = require('@aws-cdk/cdk');

const app = new cdk.App();


const vpc = new VpcStack(app, 'Vpc');
new ApigwVpcNlbStack(app, 'ApigwVpcNlbStack', { vpcRefProps: vpc.vpcRefProps });

app.run();