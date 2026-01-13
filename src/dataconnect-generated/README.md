# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTeams*](#listteams)
  - [*ListMatches*](#listmatches)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreatePrediction*](#createprediction)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListTeams
You can execute the `ListTeams` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTeams(): QueryPromise<ListTeamsData, undefined>;

interface ListTeamsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTeamsData, undefined>;
}
export const listTeamsRef: ListTeamsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTeams(dc: DataConnect): QueryPromise<ListTeamsData, undefined>;

interface ListTeamsRef {
  ...
  (dc: DataConnect): QueryRef<ListTeamsData, undefined>;
}
export const listTeamsRef: ListTeamsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTeamsRef:
```typescript
const name = listTeamsRef.operationName;
console.log(name);
```

### Variables
The `ListTeams` query has no variables.
### Return Type
Recall that executing the `ListTeams` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTeamsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTeamsData {
  teams: ({
    id: UUIDString;
    name: string;
    logoUrl?: string | null;
    description?: string | null;
    region: string;
  } & Team_Key)[];
}
```
### Using `ListTeams`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTeams } from '@dataconnect/generated';


// Call the `listTeams()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTeams();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTeams(dataConnect);

console.log(data.teams);

// Or, you can use the `Promise` API.
listTeams().then((response) => {
  const data = response.data;
  console.log(data.teams);
});
```

### Using `ListTeams`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTeamsRef } from '@dataconnect/generated';


// Call the `listTeamsRef()` function to get a reference to the query.
const ref = listTeamsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTeamsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.teams);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.teams);
});
```

## ListMatches
You can execute the `ListMatches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMatches(): QueryPromise<ListMatchesData, undefined>;

interface ListMatchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMatchesData, undefined>;
}
export const listMatchesRef: ListMatchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMatches(dc: DataConnect): QueryPromise<ListMatchesData, undefined>;

interface ListMatchesRef {
  ...
  (dc: DataConnect): QueryRef<ListMatchesData, undefined>;
}
export const listMatchesRef: ListMatchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMatchesRef:
```typescript
const name = listMatchesRef.operationName;
console.log(name);
```

### Variables
The `ListMatches` query has no variables.
### Return Type
Recall that executing the `ListMatches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMatchesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMatchesData {
  matches: ({
    id: UUIDString;
    team1: {
      name: string;
      logoUrl?: string | null;
    };
      team2: {
        name: string;
        logoUrl?: string | null;
      };
        matchTime: TimestampString;
        status: string;
        streamLink?: string | null;
        tournamentName?: string | null;
  } & Match_Key)[];
}
```
### Using `ListMatches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMatches } from '@dataconnect/generated';


// Call the `listMatches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMatches();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMatches(dataConnect);

console.log(data.matches);

// Or, you can use the `Promise` API.
listMatches().then((response) => {
  const data = response.data;
  console.log(data.matches);
});
```

### Using `ListMatches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMatchesRef } from '@dataconnect/generated';


// Call the `listMatchesRef()` function to get a reference to the query.
const ref = listMatchesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMatchesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.matches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.matches);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreatePrediction
You can execute the `CreatePrediction` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createPrediction(vars: CreatePredictionVariables): MutationPromise<CreatePredictionData, CreatePredictionVariables>;

interface CreatePredictionRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePredictionVariables): MutationRef<CreatePredictionData, CreatePredictionVariables>;
}
export const createPredictionRef: CreatePredictionRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPrediction(dc: DataConnect, vars: CreatePredictionVariables): MutationPromise<CreatePredictionData, CreatePredictionVariables>;

interface CreatePredictionRef {
  ...
  (dc: DataConnect, vars: CreatePredictionVariables): MutationRef<CreatePredictionData, CreatePredictionVariables>;
}
export const createPredictionRef: CreatePredictionRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPredictionRef:
```typescript
const name = createPredictionRef.operationName;
console.log(name);
```

### Variables
The `CreatePrediction` mutation requires an argument of type `CreatePredictionVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePredictionVariables {
  matchId: UUIDString;
  predictedWinnerId: UUIDString;
}
```
### Return Type
Recall that executing the `CreatePrediction` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePredictionData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePredictionData {
  prediction_insert: Prediction_Key;
}
```
### Using `CreatePrediction`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPrediction, CreatePredictionVariables } from '@dataconnect/generated';

// The `CreatePrediction` mutation requires an argument of type `CreatePredictionVariables`:
const createPredictionVars: CreatePredictionVariables = {
  matchId: ..., 
  predictedWinnerId: ..., 
};

// Call the `createPrediction()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPrediction(createPredictionVars);
// Variables can be defined inline as well.
const { data } = await createPrediction({ matchId: ..., predictedWinnerId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPrediction(dataConnect, createPredictionVars);

console.log(data.prediction_insert);

// Or, you can use the `Promise` API.
createPrediction(createPredictionVars).then((response) => {
  const data = response.data;
  console.log(data.prediction_insert);
});
```

### Using `CreatePrediction`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPredictionRef, CreatePredictionVariables } from '@dataconnect/generated';

// The `CreatePrediction` mutation requires an argument of type `CreatePredictionVariables`:
const createPredictionVars: CreatePredictionVariables = {
  matchId: ..., 
  predictedWinnerId: ..., 
};

// Call the `createPredictionRef()` function to get a reference to the mutation.
const ref = createPredictionRef(createPredictionVars);
// Variables can be defined inline as well.
const ref = createPredictionRef({ matchId: ..., predictedWinnerId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPredictionRef(dataConnect, createPredictionVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.prediction_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.prediction_insert);
});
```

