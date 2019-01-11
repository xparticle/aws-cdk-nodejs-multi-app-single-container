//Add VPC
import cdk = require('@aws-cdk/cdk');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');
import nlb = require('@aws-cdk/aws-elasticloadbalancingv2');

interface NLBStackProps {
    vpcRefProps: ec2.VpcNetworkImportProps;
}

class NLBStack extends cdk.Stack {

    constructor(parent: cdk.App, name: string, props: NLBStackProps) {
        super(parent, name);

        const vpc = ec2.VpcNetwork.import(this, "ParentVPC", props.vpcRefProps);

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

        //** move this code block that adds targets to listener to ecs app */
        
        api1_listener.addTargets('api1_target', {
            port: 2000,
            //argets: [asg]
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

export default NLBStack;