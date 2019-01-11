
import VpcStack from "./vpc";


import cdk = require('@aws-cdk/cdk');
import NLBStack from "./nlb";

const app = new cdk.App();


const vpc = new VpcStack(app, 'Vpc');
const nlb = new NLBStack(app,'Nlb',{ vpcRefProps: vpc.vpcRefProps });


app.run();