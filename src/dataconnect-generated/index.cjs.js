const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'cs2-prediction-frontend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const listTeamsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTeams');
}
listTeamsRef.operationName = 'ListTeams';
exports.listTeamsRef = listTeamsRef;

exports.listTeams = function listTeams(dc) {
  return executeQuery(listTeamsRef(dc));
};

const createPredictionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePrediction', inputVars);
}
createPredictionRef.operationName = 'CreatePrediction';
exports.createPredictionRef = createPredictionRef;

exports.createPrediction = function createPrediction(dcOrVars, vars) {
  return executeMutation(createPredictionRef(dcOrVars, vars));
};

const listMatchesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListMatches');
}
listMatchesRef.operationName = 'ListMatches';
exports.listMatchesRef = listMatchesRef;

exports.listMatches = function listMatches(dc) {
  return executeQuery(listMatchesRef(dc));
};
