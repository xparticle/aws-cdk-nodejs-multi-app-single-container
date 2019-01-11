#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');
import ecs = require('@aws-cdk/aws-ecs');
import codepipeline = require('@aws-cdk/aws-codepipeline');
// import ScalableTargetResource = require('@aws-cdk/aws-applicationautoscaling');
import codecommit = require('@aws-cdk/aws-codecommit');
import codebuild = require('@aws-cdk/aws-codebuild');

import apigateway = require('@aws-cdk/aws-apigateway');
import nlb = require('@aws-cdk/aws-elasticloadbalancingv2');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AnyIPv4 } from '@aws-cdk/aws-ec2';

interface ApigwVpcNlbStackProps {
    vpcRefProps: ec2.VpcNetworkRefProps;
}

class ApigwVpcNlbStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: ApigwVpcNlbStackProps) {
        super(parent, name);

        const vpc = ec2.VpcNetwork.import(this, "MyOtherBucket", props.vpcRefProps);


        const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro),
            machineImage: new ec2.AmazonLinuxImage() // get the latest Amazon Linux image
        });

        //Build three Code Commit Repositories.
        const api1_ccrepo = new codecommit.Repository(this, 'apigw-1', {
            repositoryName: 'api-1',
            description: 'API -1 written in Node.js', // optional property
        });

        const api2_ccrepo = new codecommit.Repository(this, 'apigw-2', {
            repositoryName: 'api-2',
            description: 'API -2 written in Node.js', // optional property
        });

        const api3_ccrepo = new codecommit.Repository(this, 'apigw-3', {
            repositoryName: 'api-3',
            description: 'API -3 written in Node.js', // optional property
        });

        //Build three API Gateway resources

        const api = new apigateway.RestApi(this, 'api', {
            endpointTypes: [apigateway.EndpointType.Regional]
        });
        api.root.addMethod('ANY');

        const api1 = api.root.addResource('api1');
        
        const proxy = api1.addProxy({
            defaultIntegration: new apigateway.Integration({
                uri: "http://localhost.com:5000/{proxy}"
                proxy: true,
                type: apigateway.IntegrationType.AwsProxy,
                

            }),
          
            // "false" will require explicitly adding methods on the `proxy` resource
            //anyMethod: true // "true" is the default
          });

        api1.addMethod('ANY');


        const api2 = api.root.addResource('api2');
        api2.addMethod('ANY');


        const api3 = api.root.addResource('api3');
        api3.addMethod('ANY');




        //Add NLB

        const lb = new nlb.NetworkLoadBalancer(this, 'LB', {
            vpc,
            internetFacing: false
        });

        //Add Listener#1

        const api1_listener = lb.addListener('api1_listener', {
            port: 2000
        });

        const api2_listener = lb.addListener('api2_listener', {
            port: 3000,

        });

        const api3_listener = lb.addListener('api3_listener', {
            port: 4000,

        });

        api1_listener.addTargets('api1_target', {
            port: 2000,
            targets: [asg]
            //protocol: ec2.Protocol.Tcp
        });
        api2_listener.addTargets('api2_target', {
            port: 3000,
            //protocol: ec2.Protocol.Tcp
        });
        api3_listener.addTargets('api3_target', {
            port: 4000,
            //protocol: ec2.Protocol.Tcp
        });




    }
}

export default ApigwVpcNlbStack;
