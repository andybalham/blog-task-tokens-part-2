/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */

import axios from 'axios';
import { ValuationResponse } from './ValuationResponse';
import { ValuationStateMachineData } from './ValuationStateMachineData';

export const handler = async (
  event: ValuationStateMachineData
): Promise<void> => {
  console.log(JSON.stringify({ event }, null, 2));

  const valuationResponse: ValuationResponse = {
    valuationReference:
      event.property.nameOrNumber === 'Unknown reference'
        ? 'unknown-ref'
        : event.valuationReference,
    propertyValue: 666000,
    failed:
      event.property.nameOrNumber === 'Failed response' ? true : undefined,
  };

  const response = await axios.post(event.callbackUrl, valuationResponse);

  console.log(JSON.stringify({ 'response.status': response.status }, null, 2));

  if (event.property.nameOrNumber === 'Duplicate response') {
    const duplicateResponse = await axios.post(
      event.callbackUrl,
      valuationResponse
    );

    console.log(
      JSON.stringify(
        { 'duplicateResponse.status': duplicateResponse.status },
        null,
        2
      )
    );
  }
};
