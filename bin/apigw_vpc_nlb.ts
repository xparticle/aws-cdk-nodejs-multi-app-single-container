#!/usr/bin/env node
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');
import s3 = require('@aws-cdk/aws-s3');

import codepipeline = require('@aws-cdk/aws-codepipeline');
// import ScalableTargetResource = require('@aws-cdk/aws-applicationautoscaling');
import codecommit = require('@aws-cdk/aws-codecommit');
import codebuild = require('@aws-cdk/aws-codebuild');

import apigateway = require('@aws-cdk/aws-apigateway');

import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AnyIPv4 } from '@aws-cdk/aws-ec2';

interface ApigwVpcNlbStackProps {
    vpcRefProps: ec2.VpcNetworkImportProps;
}

class ApigwVpcNlbStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: ApigwVpcNlbStackProps) {
        super(parent, name);

        const vpc = ec2.VpcNetwork.import(this, "ParentVPC", props.vpcRefProps);


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
                uri: "http://localhost.com:5000/{proxy}",
                //proxy: true,
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









    }
}

export default ApigwVpcNlbStack;
