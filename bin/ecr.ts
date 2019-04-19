import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');

import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import autoscaling = require('@aws-cdk/aws-autoscaling');
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';
import { AnyIPv4 } from '@aws-cdk/aws-ec2';

import s3 = require('@aws-cdk/aws-s3');

import codepipeline = require('@aws-cdk/aws-codepipeline');
// import ScalableTargetResource = require('@aws-cdk/aws-applicationautoscaling');
import codecommit = require('@aws-cdk/aws-codecommit');
import codebuild = require('@aws-cdk/aws-codebuild');


class EcrStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: EcrStackProps) {
        super(parent, name);

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


        const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc,
            instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Micro),
            machineImage: new ec2.AmazonLinuxImage() // get the latest Amazon Linux image
        });


    }
}

export default EcrStack;        