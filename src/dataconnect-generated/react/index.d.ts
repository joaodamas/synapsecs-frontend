import { CreateUserData, ListTeamsData, CreatePredictionData, CreatePredictionVariables, ListMatchesData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListTeams(options?: useDataConnectQueryOptions<ListTeamsData>): UseDataConnectQueryResult<ListTeamsData, undefined>;
export function useListTeams(dc: DataConnect, options?: useDataConnectQueryOptions<ListTeamsData>): UseDataConnectQueryResult<ListTeamsData, undefined>;

export function useCreatePrediction(options?: useDataConnectMutationOptions<CreatePredictionData, FirebaseError, CreatePredictionVariables>): UseDataConnectMutationResult<CreatePredictionData, CreatePredictionVariables>;
export function useCreatePrediction(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePredictionData, FirebaseError, CreatePredictionVariables>): UseDataConnectMutationResult<CreatePredictionData, CreatePredictionVariables>;

export function useListMatches(options?: useDataConnectQueryOptions<ListMatchesData>): UseDataConnectQueryResult<ListMatchesData, undefined>;
export function useListMatches(dc: DataConnect, options?: useDataConnectQueryOptions<ListMatchesData>): UseDataConnectQueryResult<ListMatchesData, undefined>;
