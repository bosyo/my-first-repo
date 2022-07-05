import {
  TEST
} from './action-types';

export function test(payload) {
  return {
    type: TEST,
    payload,
  };
}
