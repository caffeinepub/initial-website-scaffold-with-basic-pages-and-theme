import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Certificate, CertificateId } from '../backend';
import { toast } from 'sonner';

export function useGetAllCertificates() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCertificates();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      issuingOrganization,
      issueDate,
      credentialUrl,
    }: {
      title: string;
      issuingOrganization: string;
      issueDate: string;
      credentialUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addCertificate(title, issuingOrganization, issueDate, credentialUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate added successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to add certificate';
      toast.error(message);
    },
  });
}

export function useEditCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      issuingOrganization,
      issueDate,
      credentialUrl,
    }: {
      id: CertificateId;
      title: string;
      issuingOrganization: string;
      issueDate: string;
      credentialUrl: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editCertificate(id, title, issuingOrganization, issueDate, credentialUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate updated successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to update certificate';
      toast.error(message);
    },
  });
}

export function useDeleteCertificate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: CertificateId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCertificate(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Certificate deleted successfully');
    },
    onError: (error: any) => {
      const message = error.message || 'Failed to delete certificate';
      toast.error(message);
    },
  });
}
