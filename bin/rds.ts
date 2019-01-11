import ec2 = require('@aws-cdk/aws-ec2');
import rds = require('@aws-cdk/aws-rds');
import cdk = require('@aws-cdk/cdk');

class MyStack extends cdk.Stack {
  constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
    super(parent, name, props);

    const vpc = new ec2.VpcNetwork(this, 'VPC');

    new rds.DatabaseCluster(this, 'MyRdsDb', {
      defaultDatabaseName: 'MyAuroraDatabase',
      masterUser: {
        username: 'admin',
        password: '123456'
      },
      engine: rds.DatabaseClusterEngine.Aurora,
      instanceProps: {
        instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
        vpc: vpc,
        vpcPlacement: {
          subnetsToUse: ec2.SubnetType.Public
        }
      }
    });
  }
}

const app = new cdk.App();

new MyStack(app, 'MyStack');

app.run();