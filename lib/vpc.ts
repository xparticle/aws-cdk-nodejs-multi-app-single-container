//Add VPC
import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');
import { CfnVPCEndpoint } from '@aws-cdk/aws-ec2';

class VPCStack extends cdk.Stack {
    public readonly vpcRefProps: ec2.VpcNetworkImportProps;
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);



        const vpc = new ec2.VpcNetwork(this, 'TheVPC', {
            cidr: '10.0.0.0/16',
            natGateways: 1,
            vpnGateway: true,
            maxAZs:1 ,
            subnetConfiguration: [
                {
                    name: 'Application',
                    cidrMask: 26,
                    subnetType: ec2.SubnetType.Private,
                },
                {
                    name: 'Public',
                    cidrMask: 26,
                    subnetType: ec2.SubnetType.Public,
                }
            ],
        });
        const s3_vpc_endpoint= new CfnVPCEndpoint(this,'s3_vpc_endpoint',{
            serviceName: 'com.amazonaws.us-east-1.s3',
            vpcId: vpc.vpcId,
            vpcEndpointType:'Gateway'

        });

        const ecr_vpc_endpoint= new CfnVPCEndpoint(this,'ecr_vpc_endpoint',{
            serviceName: 'com.amazonaws.us-east-1.ecr.dkr',
            vpcId: vpc.vpcId,
            vpcEndpointType:'Interface',
            subnetIds: vpc.subnetIds({subnetType:ec2.SubnetType.Private})
        });
        const ecs_agent_vpc_endpoint= new CfnVPCEndpoint(this,'ecs_agent_vpc_endpoint',{
            serviceName: 'com.amazonaws.us-east-1.ecs-agent',
            vpcId: vpc.vpcId,
            vpcEndpointType:'Interface',
            subnetIds: vpc.subnetIds({subnetType:ec2.SubnetType.Private})
        });
        const ecs_telemetry_vpc_endpoint= new CfnVPCEndpoint(this,'ecs_telemetry_vpc_endpoint',{
            serviceName: 'com.amazonaws.us-east-1.ecs-telemetry',
            vpcId: vpc.vpcId,
            vpcEndpointType:'Interface',
            subnetIds: vpc.subnetIds({subnetType:ec2.SubnetType.Private})
        });

        const ecs_vpc_endpoint= new CfnVPCEndpoint(this,'ecs_vpc_endpoint',{
            serviceName: 'com.amazonaws.us-east-1.ecs',
            vpcId: vpc.vpcId,
            vpcEndpointType:'Interface',
            subnetIds: vpc.subnetIds({subnetType:ec2.SubnetType.Private})
        });

        const cc_vpc_endpoint= new CfnVPCEndpoint(this,'cc_vpc_endpoint',{
            serviceName: 'com.amazonaws.us-east-1.git-codecommit',
            vpcId: vpc.vpcId,
            vpcEndpointType:'Interface',
            subnetIds: vpc.subnetIds({subnetType:ec2.SubnetType.Private})
        });

        this.vpcRefProps = vpc.export();


    }
}

export default VPCStack;