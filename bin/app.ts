import cdk = require('@aws-cdk/cdk');
import NLBStack from "../lib/nlb";
import ECSStack from "../lib/ecs";
import VPCStack from "../lib/vpc"
import ApigwStack from "../lib/apigw";

const app = new cdk.App();

const vpc = new VPCStack(app, 'VPC');

const nlb = new NLBStack(app, 'NLB', { vpcRefProps: vpc.vpcRefProps });

const ecs = new ECSStack(app, 'ECS', { vpcRefProps: vpc.vpcRefProps });

const apigw = new ApigwStack(app, 'APIGW', { nlbRefProps: nlb.nlbRefProps });

const target1 = nlb.listener1.addTargets('NLB_Target_1', {
    port: 2000,
    targets: [ecs.service1]
  });

const target2 = nlb.listener2.addTargets('NLB_Target_2', {
    port: 3000,
    targets: [ecs.service1]
  });

const target3 = nlb.listener3.addTargets('NLB_Target_3', {
    port: 4000,
    targets: [ecs.service1]
  });  

app.run();