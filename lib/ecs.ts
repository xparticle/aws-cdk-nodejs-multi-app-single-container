//Add VPC
import cdk = require('@aws-cdk/cdk');
import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');
import { NetworkMode, AwsLogDriver } from '@aws-cdk/aws-ecs';
import { Repository } from '@aws-cdk/aws-ecr';
import { IRepository } from '@aws-cdk/aws-ecr';

interface ECSStackProps {
    vpcRefProps: ec2.VpcNetworkImportProps;
}

class ECSStack extends cdk.Stack {
    public readonly service1: ecs.FargateService;


    constructor(parent: cdk.App, name: string, props: ECSStackProps) {
        super(parent, name);

        const vpc = ec2.VpcNetwork.import(this, "ParentVPC", props.vpcRefProps);

        // Create an ECS cluster
        const cluster = new ecs.Cluster(this, 'Cluster', {
            vpc,
        });
        
        //***** Add a Task Execution role here for logging to work or may be not needed ? */

        const taskDefinition = new ecs.TaskDefinition(this, 'TaskDef', {
            memoryMiB: '512',
            cpu: '256',
            networkMode: NetworkMode.AwsVpc,
            compatibility: ecs.Compatibility.Fargate,
            // executionRole:
        });  
        ecs.LogDriver
        taskDefinition.addContainer("WebContainer", {
            // Use an image from DockerHub for now, change this to image from ecr repository
            image: ecs.ContainerImage.fromRegistry("maddulap/node-hello-world-api-multiple-ports"),
            logging: new ecs.AwsLogDriver(this, 'TaskLogging', { streamPrefix: 'service1' })
            
            // ... other options here ...
        }).addPortMappings({"containerPort":2000},{"containerPort":3000},{"containerPort":4000});


        const service1 = new ecs.FargateService(this, 'Service1', {
            cluster,
            taskDefinition,
            desiredCount: 1
          });

          this.service1= service1;




    }

}

export default ECSStack;