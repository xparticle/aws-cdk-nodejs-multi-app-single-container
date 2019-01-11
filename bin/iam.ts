//Add VPC
import cdk = require('@aws-cdk/cdk');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');

class IAMStack extends cdk.Stack {
    public readonly cproleRefProps: iam.RoleProps;
    public readonly cbroleRefProps: iam.RoleProps;
    public readonly kmskey1RefProps: kms.EncryptionKeyRefProps;
    public readonly kmskey2RefProps: kms.EncryptionKeyRefProps;


    constructor(parent: cdk.App, name: string, props?: cdk.StackProps) {
        super(parent, name, props);

        const cprole = new iam.Role(this, 'CodePipeLineRole', {
            roleName: "tiaa_new_code_pipeline_role",
            assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com'),

        });



        const policystatement_1 = new iam.PolicyStatement();
        policystatement_1.addActions("s3:PutObject", "s3:GetObject", "s3:GetObjectVersion");
        policystatement_1.allow();
        policystatement_1.addResource("arn:aws:s3:::codepipeline-us-east-1-*")

        const policystatement_2 = new iam.PolicyStatement();
        policystatement_2.addActions("s3:*", "ecr:*", "ssm:GetParameters", "secretsmanager:GetSecretValue");
        policystatement_2.allow();
        policystatement_2.addResource("arn:aws:ssm:us-east-1:857542160605:parameter/dev/tier1/config1");
        policystatement_2.addResource("arn:aws:ssm:us-east-1:857542160605:parameter/dev/tier1/config2");
        policystatement_2.addResource("arn:aws:ssm:us-east-1:857542160605:parameter/aws/reference/secretsmanager/apikey1");
        policystatement_2.addResource("arn:aws:s3:::madulap-code-pipeline-cache");
        policystatement_2.addResource("arn:aws:s3:::*/*"),
        policystatement_2.addResource("arn:aws:ecr:us-east-1:857542160605:repository/workshop");
        policystatement_2.addResource("arn:aws:ecr:us-east-1:857542160605:repository/ytd_ror");
        policystatement_2.addResource("arn:aws:ecr:us-east-1:857542160605:repository/tier-1-service-1");
        policystatement_2.addResource("arn:aws:ecr:us-east-1:857542160605:repository/tiaa_codebuild");
        policystatement_2.addResource("arn:aws:ecr:us-east-1:857542160605:repository/aws_codebuild_docker");
        policystatement_2.addResource("arn:aws:secretsmanager:us-east-1:857542160605:secret:apikey1-e15TKd");

        const policystatement_3 = new iam.PolicyStatement();
        policystatement_3.addActions("ecr:GetAuthorizationToken");
        policystatement_3.allow();
        policystatement_3.addResource("*")

        const cppolicy = new iam.Policy(this, 'CodePipeLinePolicy', {
            policyName: "tiaa_new_code_pipeline_policy"


        })

        cppolicy.addStatement(policystatement_1);
        cppolicy.attachToRole(cprole);

        const cbrole = new iam.Role(this, 'CodeBuildRole', {
            roleName: "tiaa_new_code_build_role",
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),

        });

        const cbpolicy = new iam.Policy(this, 'CodeBuildPolicy', {
            policyName: "tiaa_new_code_build_policy"


        })

        cbpolicy.addStatement(policystatement_1);
        cbpolicy.addStatement(policystatement_2);
        cbpolicy.addStatement(policystatement_3);
        cbpolicy.attachToRole(cbrole);

        const kms_key_policy_statement_1 = new iam.PolicyStatement();
        kms_key_policy_statement_1.addActions("kms:Encrypt", "kms:Decrypt", "kms:ReEncrypt*", "kms:GenerateDataKey*", "kms:DescribeKey");
        kms_key_policy_statement_1.allow();
        kms_key_policy_statement_1.addAwsPrincipal(cbrole.roleArn);
        kms_key_policy_statement_1.addResource("arn:aws:kms:us-east-1:857542160605:key/e1ae4116-6eff-4eca-9ef1-47cb0b4042bf")

        const kms_key_policy_statement_2 = new iam.PolicyStatement();
        kms_key_policy_statement_2.addActions("kms:CreateGrant", "kms:ListGrants", "kms:RevokeGrant");
        kms_key_policy_statement_2.allow();
        kms_key_policy_statement_2.addAwsPrincipal(cbrole.roleArn)
        kms_key_policy_statement_2.addResource("arn:aws:kms:us-east-1:857542160605:key/e1ae4116-6eff-4eca-9ef1-47cb0b4042bf")
        kms_key_policy_statement_2.addCondition("Bool", { "kms:GrantIsForAWSResource": true });




        this.cproleRefProps = vpc.export();


    }
}

export default IAMStack;