import {
  SET_ANALYTIC_TYPE,
  SET_ANALYTIC_MONTH
} from './action-types';

export function setAnalyticType(payload) {
  return {
    type: SET_ANALYTIC_TYPE,
    payload,
  };
}

export function setAnalyticMonth(payload) {
  return {
    type: SET_ANALYTIC_MONTH,
    payload,
  };
}
