import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreatePredictionData {
  prediction_insert: Prediction_Key;
}

export interface CreatePredictionVariables {
  matchId: UUIDString;
  predictedWinnerId: UUIDString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

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

export interface ListTeamsData {
  teams: ({
    id: UUIDString;
    name: string;
    logoUrl?: string | null;
    description?: string | null;
    region: string;
  } & Team_Key)[];
}

export interface Match_Key {
  id: UUIDString;
  __typename?: 'Match_Key';
}

export interface Prediction_Key {
  id: UUIDString;
  __typename?: 'Prediction_Key';
}

export interface Team_Key {
  id: UUIDString;
  __typename?: 'Team_Key';
}

export interface UserFollowTeam_Key {
  userId: UUIDString;
  teamId: UUIDString;
  __typename?: 'UserFollowTeam_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListTeamsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTeamsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTeamsData, undefined>;
  operationName: string;
}
export const listTeamsRef: ListTeamsRef;

export function listTeams(): QueryPromise<ListTeamsData, undefined>;
export function listTeams(dc: DataConnect): QueryPromise<ListTeamsData, undefined>;

interface CreatePredictionRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePredictionVariables): MutationRef<CreatePredictionData, CreatePredictionVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePredictionVariables): MutationRef<CreatePredictionData, CreatePredictionVariables>;
  operationName: string;
}
export const createPredictionRef: CreatePredictionRef;

export function createPrediction(vars: CreatePredictionVariables): MutationPromise<CreatePredictionData, CreatePredictionVariables>;
export function createPrediction(dc: DataConnect, vars: CreatePredictionVariables): MutationPromise<CreatePredictionData, CreatePredictionVariables>;

interface ListMatchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMatchesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMatchesData, undefined>;
  operationName: string;
}
export const listMatchesRef: ListMatchesRef;

export function listMatches(): QueryPromise<ListMatchesData, undefined>;
export function listMatches(dc: DataConnect): QueryPromise<ListMatchesData, undefined>;

