//Add VPC
import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');

class VPCStack extends cdk.Stack {
    public readonly vpcRefProps: ec2.VpcNetworkRefProps;
    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);


        const vpc = new ec2.VpcNetwork(this, 'TheVPC', {
            cidr: '10.0.0.0/16',
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 26,
                    name: 'Public',
                    subnetType: ec2.SubnetType.Public,
                },
                {
                    name: 'Application',
                    subnetType: ec2.SubnetType.Private,
                },
                {
                    cidrMask: 27,
                    name: 'Database',
                    subnetType: ec2.SubnetType.Isolated,
                }
            ],
        });

        this.vpcRefProps = vpc.export();


    }
}

export default VPCStack;