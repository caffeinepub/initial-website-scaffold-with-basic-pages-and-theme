import { useInternetIdentity } from './useInternetIdentity';
import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAuthz() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: isAdminLoading } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    isAuthenticated,
    isAdmin: isAdmin ?? false,
    isLoading: actorFetching || isAdminLoading,
  };
}
