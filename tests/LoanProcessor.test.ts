/* eslint-disable no-console */
import {
  IntegrationTestClient,
  StepFunctionsTestClient,
} from '@andybalham/cdk-cloud-test-kit';
import { nanoid } from 'nanoid';
import { LoanApplication } from 'src/LoanApplication';
import TaskTokenTestStack from '../src/TaskTokenTestStack';

jest.setTimeout(2 * 60 * 1000);

describe('TaskTokenTestStack Test Suite', () => {
  //
  const testClient = new IntegrationTestClient({
    testStackId: TaskTokenTestStack.Id,
  });

  let loanProcessorStateMachine: StepFunctionsTestClient;

  beforeAll(async () => {
    await testClient.initialiseClientAsync();

    loanProcessorStateMachine = testClient.getStepFunctionsTestClient(
      TaskTokenTestStack.LoanProcessorStateMachineId
    );
  });

  beforeEach(async () => {
    await testClient.initialiseTestAsync();
  });

  it('tests a prompt callback', async () => {
    // Arrange

    const loanApplication: LoanApplication = {
      applicationReference: `app-${nanoid()}`,
      property: {
        nameOrNumber: '999',
        postcode: 'PO1 1CE',
      },
    };

    // Act

    await loanProcessorStateMachine.startExecutionAsync(loanApplication);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => loanProcessorStateMachine.isExecutionFinishedAsync(),
    });

    // Assert

    expect(timedOut).toEqual(false);

    const status = await loanProcessorStateMachine.getStatusAsync();

    expect(status).toEqual('SUCCEEDED');
  });

  it('tests a late callback', async () => {
    // Arrange

    const loanApplication: LoanApplication = {
      applicationReference: `app-${nanoid()}`,
      property: {
        nameOrNumber: 'Late callback',
        postcode: 'PO1 1CE',
      },
    };

    // Act

    await loanProcessorStateMachine.startExecutionAsync(loanApplication);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => loanProcessorStateMachine.isExecutionFinishedAsync(),
      intervalSeconds: 10,
      timeoutSeconds: 60,
    });

    // Assert

    expect(timedOut).toEqual(false);

    const status = await loanProcessorStateMachine.getStatusAsync();

    expect(status).toEqual('FAILED');

    const lastEvent = await loanProcessorStateMachine.getLastEventAsync();

    expect(
      lastEvent?.executionFailedEventDetails?.error === 'States.Timeout'
    ).toBeTruthy();
  });

  it('tests no callback', async () => {
    // Arrange

    const loanApplication: LoanApplication = {
      applicationReference: `app-${nanoid()}`,
      property: {
        nameOrNumber: 'No callback',
        postcode: 'PO1 1CE',
      },
    };

    // Act

    await loanProcessorStateMachine.startExecutionAsync(loanApplication);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => loanProcessorStateMachine.isExecutionFinishedAsync(),
      intervalSeconds: 10,
      timeoutSeconds: 90,
    });

    // Assert

    expect(timedOut).toEqual(false);

    const status = await loanProcessorStateMachine.getStatusAsync();

    expect(status).toEqual('FAILED');

    const lastEvent = await loanProcessorStateMachine.getLastEventAsync();

    expect(
      lastEvent?.executionFailedEventDetails?.error === 'States.Timeout'
    ).toBeTruthy();
  });

  it('tests unknown response', async () => {
    // Arrange

    const loanApplication: LoanApplication = {
      applicationReference: `app-${nanoid()}`,
      property: {
        nameOrNumber: 'Unknown response',
        postcode: 'PO1 1CE',
      },
    };

    // Act

    await loanProcessorStateMachine.startExecutionAsync(loanApplication);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => loanProcessorStateMachine.isExecutionFinishedAsync(),
      intervalSeconds: 10,
      timeoutSeconds: 60,
    });

    // Assert

    expect(timedOut).toEqual(false);

    const status = await loanProcessorStateMachine.getStatusAsync();

    expect(status).toEqual('FAILED');

    const lastEvent = await loanProcessorStateMachine.getLastEventAsync();

    expect(
      lastEvent?.executionFailedEventDetails?.error === 'States.Timeout'
    ).toBeTruthy();
  });

  it('tests failed response', async () => {
    // Arrange

    const loanApplication: LoanApplication = {
      applicationReference: `app-${nanoid()}`,
      property: {
        nameOrNumber: 'Failed response',
        postcode: 'PO1 1CE',
      },
    };

    // Act

    await loanProcessorStateMachine.startExecutionAsync(loanApplication);

    // Await

    const { timedOut } = await testClient.pollTestAsync({
      until: async () => loanProcessorStateMachine.isExecutionFinishedAsync(),
      intervalSeconds: 10,
      timeoutSeconds: 90,
    });

    // Assert

    expect(timedOut).toEqual(false);

    const status = await loanProcessorStateMachine.getStatusAsync();

    expect(status).toEqual('FAILED');

    const lastEvent = await loanProcessorStateMachine.getLastEventAsync();

    expect(
      lastEvent?.executionFailedEventDetails?.error === 'Valuation Failed'
    ).toBeTruthy();
  });
});
