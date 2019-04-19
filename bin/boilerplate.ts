import cdk = require('@aws-cdk/cdk');
import ec2 = require('@aws-cdk/aws-ec2');


interface BoilerStackProps {
    vpcRefProps: ec2.VpcNetworkImportProps;
}

class BoilerStack extends cdk.Stack {

    constructor(parent: cdk.App, name: string, props: BoilerStackProps) {
        super(parent, name);

        const vpc = ec2.VpcNetwork.import(this, "ParentVPC", props.vpcRefProps);
    }

}

export default BoilerStack;