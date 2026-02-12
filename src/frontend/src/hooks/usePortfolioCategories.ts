import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PortfolioCategory, CategoryId } from '../backend';
import { toast } from 'sonner';

export function useGetAllCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PortfolioCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCategory(name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to create category';
      toast.error(message);
    },
  });
}

export function useEditCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, description }: { id: CategoryId; name: string; description: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editCategory(id, name, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update category';
      toast.error(message);
    },
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: CategoryId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['works'] });
      toast.success('Category and associated works deleted successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to delete category';
      toast.error(message);
    },
  });
}
