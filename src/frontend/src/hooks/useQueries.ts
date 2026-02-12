import { useActor } from './useActor';

// This file is ready for future backend integration
// Add React Query hooks here when backend functionality is needed

export function useBackendQueries() {
  const { actor, isFetching } = useActor();
  
  return {
    actor,
    isFetching,
  };
}
