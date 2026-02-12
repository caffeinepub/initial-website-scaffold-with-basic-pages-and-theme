import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PhotographyWork, WorkId, CategoryId } from '../backend';
import { toast } from 'sonner';

export function useGetAllWorks() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PhotographyWork[]>({
    queryKey: ['works'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWorks();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWorksByCategory(categoryId: CategoryId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PhotographyWork[]>({
    queryKey: ['works', 'category', categoryId?.toString()],
    queryFn: async () => {
      if (!actor || categoryId === null) return [];
      return actor.getWorksByCategory(categoryId);
    },
    enabled: !!actor && !actorFetching && categoryId !== null,
  });
}

export function useAddPhotographyWork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      imageUrl,
      categoryId,
    }: {
      title: string;
      description: string;
      imageUrl: string;
      categoryId: CategoryId;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPhotographyWork(title, description, imageUrl, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      toast.success('Work added successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to add work';
      toast.error(message);
    },
  });
}

export function useEditPhotographyWork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      imageUrl,
      categoryId,
    }: {
      id: WorkId;
      title: string;
      description: string;
      imageUrl: string;
      categoryId: CategoryId;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editPhotographyWork(id, title, description, imageUrl, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      toast.success('Work updated successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update work';
      toast.error(message);
    },
  });
}

export function useDeletePhotographyWork() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: WorkId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deletePhotographyWork(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['works'] });
      toast.success('Work deleted successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to delete work';
      toast.error(message);
    },
  });
}
