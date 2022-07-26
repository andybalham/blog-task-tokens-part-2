/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-new */
import { IntegrationTestStack } from '@andybalham/cdk-cloud-test-kit';
import { StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import LoanProcessor from './LoanProcessor';
import MockValuationService from './valuation-service/MockValuationService';

export type DataAccessStackProps = StackProps;

export default class TaskTokenTestStack extends IntegrationTestStack {
  //
  static readonly Id = 'TaskTokenTestStack';

  static readonly LoanProcessorStateMachineId = 'LoanProcessorStateMachineId';

  static readonly ErrorTopicObserverId = 'ErrorTopicObserverId';

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      ...props,
      testStackId: TaskTokenTestStack.Id,
      testFunctionIds: [TaskTokenTestStack.ErrorTopicObserverId],
    });

    const valuationService = new MockValuationService(
      this,
      'MockValuationService'
    );

    const loanProcessor = new LoanProcessor(this, 'LoanProcessor', {
      valuationServiceUrl: valuationService.serviceUrl,
    });

    this.addTestResourceTag(
      loanProcessor.stateMachine,
      TaskTokenTestStack.LoanProcessorStateMachineId
    );

    this.addSNSTopicSubscriber(
      loanProcessor.errorTopic,
      TaskTokenTestStack.ErrorTopicObserverId
    );
  }
}
