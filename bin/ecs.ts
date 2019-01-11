//Add VPC
import cdk = require('@aws-cdk/cdk');
import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');


interface ECSStackProps {
    vpcRefProps: ec2.VpcNetworkImportProps;
}

class ECSStack extends cdk.Stack {

    constructor(parent: cdk.App, name: string, props: ECSStackProps) {
        super(parent, name);

        const vpc = ec2.VpcNetwork.import(this, "ParentVPC", props.vpcRefProps);

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc,
        });
        
        const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
            memoryMiB: '512',
            cpu: '256'
          });

        const container = fargateTaskDefinition.addContainer("WebContainer", {
            // Use an image from DockerHub for now, change this to image from ecr repository
            image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
            // ... other options here ...
        });

        // const service = new ecs.FargateService(this, 'Service', {
        //     cluster,
        //     //fargateTaskDefinition (TaskDefinition),
        //     desiredCount: 2
        //   });

    }

}

export default ECSStack;