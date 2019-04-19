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
    public readonly service2: ecs.FargateService;
    public readonly service3: ecs.FargateService;

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
            image: ecs.ContainerImage.fromRegistry("maddulap/node-web-app"),
            logging: new ecs.AwsLogDriver(this, 'TaskLogging', { streamPrefix: 'service1' })
            
            // ... other options here ...
        }).addPortMappings({
            containerPort: 80
          });


        const service1 = new ecs.FargateService(this, 'Service1', {
            cluster,
            taskDefinition,
            desiredCount: 1
          });
        
        const service2 = new ecs.FargateService(this, 'Service2', {
            cluster,
            taskDefinition,
            desiredCount: 1
          });  

        const service3 = new ecs.FargateService(this, 'Service3', {
            cluster,
            taskDefinition,
            desiredCount: 1
          });          
          //why doesn't the keyboard key travel look funky. I hope my brain adapts to this one. ahh the left anf rightkey are much bigger than th eup & down.
          //this will get some using to . whats the white notch on top left of the keyboard. the function key row is super big for some reason. I think taller than the regular keys as well. weird.

          this.service1= service1;
          this.service2= service2;
          this.service3= service3;  



    }

}

export default ECSStack;