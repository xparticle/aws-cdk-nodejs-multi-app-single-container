
import VpcStack from "./vpc";


import cdk = require('@aws-cdk/cdk');
import NLBStack from "./nlb";
import EC2Stack from "./ec2";
import ECSStack from "./ecs";
import VPCStack from "./vpc"
import ApigwStack from "./apigw";

const app = new cdk.App();


const vpc = new VPCStack(app, 'Vpc');

const nlb = new NLBStack(app, 'NLB', { vpcRefProps: vpc.vpcRefProps });

//going to using ec2 stack instead of ecs fargate stack
//const ecs = new ECSStack(app, 'ECS', { vpcRefProps: vpc.vpcRefProps });

const ec2 = new EC2Stack(app, 'EC2', { vpcRefProps: vpc.vpcRefProps });
const apigw = new ApigwStack(app, 'APIGW', { nlbRefProps: nlb.nlbRefProps });

const target1 = nlb.listener1.addTargets('Service-1', {
      port: 80,
      targets: [ec2.myasg]
    });

//Commenting out NLB Target Groups to ECS fargate Group mapping
// const target1 = nlb.listener1.addTargets('ECS', {
//     port: 80,
//     targets: [ecs.service1]
//   });

// const target2 = nlb.listener2.addTargets('ECS', {
//     port: 80,
//     targets: [ecs.service2]
//   });

// const target3 = nlb.listener3.addTargets('ECS', {
//     port: 80,
//     targets: [ecs.service3]
//   });


app.run();