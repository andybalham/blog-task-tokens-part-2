This is a companion repo for the blog post TODO

Error: Task Token is required in `payload` for callback. Use JsonPath.taskToken to set the token.
at new LambdaInvoke (D:\Users\andyb\Documents\github\blog-task-tokens\node_modules\aws-cdk-lib\aws-stepfunctions-tasks\lib\lambda\invoke.js:1:1051)

```TypeScript
          parameters: {
            'taskToken.$': JsonPath.taskToken,
            'loanApplication.$': '$',
          },
```

Error: The 'payloadResponseOnly' property cannot be used if 'integrationPattern', 'invocationType', 'clientContext', or 'qualifier' are specified.
at new LambdaInvoke (D:\Users\andyb\Documents\github\blog-task-tokens\node_modules\aws-cdk-lib\aws-stepfunctions-tasks\lib\lambda\invoke.js:1:1278)

```json
{
  "error": "States.Runtime",
  "cause": "An error occurred while executing the state 'RequestValuation' (entered at the event id #2). The Parameters '{\"FunctionName\":\"arn:aws:lambda:eu-west-2:361728023653:function:TaskTokenTestStack-LoanProcessorValuationRequestFu-fnTc5osMrMqe\",\"Payload\":{\"taskToken.$\":\"AQCwAAAAKgAAAAMAAAAAAAAAAZ83J8zGdl7Qgs8ce6YotnXrivuZegnBk22stlpw+s+XTHRHuK00ouUP/rihrqMlWPVVSOf57msrryj4IK38U54R/5+ig7tX4Leqd657Mryievv2nd5EKMjoZrBOOWzEn7WxwvI6MEtUJfk9XS4Q6VHzGDE=5tTf24YG344VeijchfL5SuTP+agqRNvWsbWTbfIr4QF4pw/7gMC/rkSXxIyr6VT1KdytfRqtoojrcgRz/SgLnCtqivS/hCwMlIq19wcLf2iJgge/BPQghDWIpn/CBxJwjSEgh+eDmMieinYHOWf5eae+q5HD322DM2F2RGc+JcXu1s0+igyT9siNaRx58pKMBlyWuwZ2xM8LVrKJtd48iWBWP8fdPUzrb0Kd+Dshl9/ETifOYuYNtDIx8DtprURT0wd0dFKU7U/F9cNFkdO0/VydkRtbUeaqI0fEf3wwNIgsXG9hVNTTwX9YHSA1twkupuAXPECBu0wkPGdmRkFpjQwJ+bszzPFB6RDyrxeLB0sauZKxCFPXieA4ZDijLBPoyE6Njqz9Zx1wlVUoEiV5EmGdAhgxfAkYl+02KDP+EVye+Lfjd3VzkG4cVLz/WdTjvPjEiwO84PgrRPitPEHbP1TQ47hhfDuvVvg/bloUXEiCvbERVXzXMbzxUw69bNIs/Y63P2W054mfbdeTihdF\",\"loanApplication\":{\"applicationReference\":\"app-Sjm6ElxPNloewR_fq149W\",\"property\":{\"nameOrNumber\":\"999\",\"postcode\":\"PO1 1CE\"}}}}' could not be used to start the Task: [The value for the field 'taskToken.$' must be a valid JSONPath or a valid intrinsic function call]"
}
```

"The value for the field 'taskToken.$' must be a valid JSONPath or a valid intrinsic function call"

```TypeScript
          parameters: {
            'taskToken': JsonPath.taskToken,
            'loanApplication.$': '$',
          },
```

```TypeScript
    this.stateMachine.grantTaskResponse(valuationCallbackFunction);
```

We need to add the following to the definition:

```TypeScript
      heartbeat: Duration.seconds(10),
      timeout: Duration.seconds(30),
```

Then we can test the timeout:

```json
{
  "errorType": "TaskTimedOut",
  "errorMessage": "Task Timed Out: 'Provided task does not exist anymore'",
  "code": "TaskTimedOut",
  "message": "Task Timed Out: 'Provided task does not exist anymore'",
  "time": "2022-07-26T18:21:39.968Z",
  "requestId": "9b5f54e3-9990-4c41-be67-9fda6c80c1f4",
  "statusCode": 400,
  "retryable": false,
  "retryDelay": 77.92116479734025,
  "stack": [
    "TaskTimedOut: Task Timed Out: 'Provided task does not exist anymore'",
    "    at Request.extractError (/var/runtime/node_modules/aws-sdk/lib/protocol/json.js:52:27)",
    "    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:106:20)",
    "    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:78:10)",
    "    at Request.emit (/var/runtime/node_modules/aws-sdk/lib/request.js:686:14)",
    "    at Request.transition (/var/runtime/node_modules/aws-sdk/lib/request.js:22:10)",
    "    at AcceptorStateMachine.runTo (/var/runtime/node_modules/aws-sdk/lib/state_machine.js:14:12)",
    "    at /var/runtime/node_modules/aws-sdk/lib/state_machine.js:26:10",
    "    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:38:9)",
    "    at Request.<anonymous> (/var/runtime/node_modules/aws-sdk/lib/request.js:688:12)",
    "    at Request.callListeners (/var/runtime/node_modules/aws-sdk/lib/sequential_executor.js:116:18)"
  ]
}
```

Links

- https://webhook.site/#!/56d2a6b8-ae54-40de-9360-5c7711a25d59/5e3efdfa-995a-4e54-9358-b6365e65cf7f/1
- [Integrating AWS Step Functions callbacks and external systems](https://aws.amazon.com/blogs/compute/integrating-aws-step-functions-callbacks-and-external-systems/)
- https://github.com/aws-samples/aws-step-functions-callback-example
- https://dev.to/lukvonstrom/best-practices-for-using-aws-stepfunctions-2io#use-waitfortasktoken
