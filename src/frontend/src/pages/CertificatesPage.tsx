import { useState } from 'react';
import { useGetAllCertificates, useAddCertificate, useEditCertificate, useDeleteCertificate } from '../hooks/useCertificates';
import { useAuthz } from '../hooks/useAuthz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Award, ExternalLink, Loader2 } from 'lucide-react';
import type { Certificate, CertificateId } from '../backend';

export default function CertificatesPage() {
  const { isAuthenticated } = useAuthz();
  const { data: certificates = [], isLoading } = useGetAllCertificates();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [title, setTitle] = useState('');
  const [issuingOrganization, setIssuingOrganization] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [deleteCertificateId, setDeleteCertificateId] = useState<CertificateId | null>(null);

  const addCertificate = useAddCertificate();
  const editCertificate = useEditCertificate();
  const deleteCertificate = useDeleteCertificate();

  const handleOpenDialog = (certificate?: Certificate) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setTitle(certificate.title);
      setIssuingOrganization(certificate.issuingOrganization);
      setIssueDate(certificate.issueDate);
      setCredentialUrl(certificate.credentialUrl);
    } else {
      setEditingCertificate(null);
      setTitle('');
      setIssuingOrganization('');
      setIssueDate('');
      setCredentialUrl('');
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !issuingOrganization.trim()) return;

    if (editingCertificate) {
      await editCertificate.mutateAsync({
        id: editingCertificate.id,
        title,
        issuingOrganization,
        issueDate,
        credentialUrl,
      });
    } else {
      await addCertificate.mutateAsync({
        title,
        issuingOrganization,
        issueDate,
        credentialUrl,
      });
    }

    setDialogOpen(false);
    setEditingCertificate(null);
    setTitle('');
    setIssuingOrganization('');
    setIssueDate('');
    setCredentialUrl('');
  };

  const handleDelete = async () => {
    if (deleteCertificateId === null) return;
    await deleteCertificate.mutateAsync(deleteCertificateId);
    setDeleteCertificateId(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Certificates</h1>
        <p className="text-lg text-muted-foreground">
          Professional certifications and achievements
        </p>
      </div>

      {/* Management Section - Only visible to authenticated users */}
      {isAuthenticated && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Management</CardTitle>
                <CardDescription>Add, edit, or remove certificates</CardDescription>
              </div>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Certificate
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {certificates.map((certificate) => (
                <div
                  key={certificate.id.toString()}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{certificate.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {certificate.issuingOrganization}
                      {certificate.issueDate && ` • ${certificate.issueDate}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenDialog(certificate)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteCertificateId(certificate.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {certificates.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No certificates yet. Add your first certificate to showcase your achievements.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Public Certificates List */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((certificate) => (
            <Card key={certificate.id.toString()} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{certificate.title}</CardTitle>
                    <CardDescription className="text-base">
                      {certificate.issuingOrganization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {certificate.issueDate && (
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Issued:</span> {certificate.issueDate}
                    </div>
                  )}
                  {certificate.credentialUrl && (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      View Credential
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No certificates to display</h3>
            <p className="text-muted-foreground">
              No certificates have been added yet.
            </p>
          </div>
        </Card>
      )}

      {/* Certificate Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
            </DialogTitle>
            <DialogDescription>
              {editingCertificate
                ? 'Update the certificate details below.'
                : 'Add a new certificate to showcase your achievements.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cert-title">Title</Label>
              <Input
                id="cert-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect"
              />
            </div>
            <div>
              <Label htmlFor="cert-org">Issuing Organization</Label>
              <Input
                id="cert-org"
                value={issuingOrganization}
                onChange={(e) => setIssuingOrganization(e.target.value)}
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            <div>
              <Label htmlFor="cert-date">Issue Date</Label>
              <Input
                id="cert-date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                placeholder="e.g., January 2024"
              />
            </div>
            <div>
              <Label htmlFor="cert-url">Credential URL (optional)</Label>
              <Input
                id="cert-url"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                placeholder="https://example.com/credential"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !title.trim() ||
                !issuingOrganization.trim() ||
                addCertificate.isPending ||
                editCertificate.isPending
              }
            >
              {addCertificate.isPending || editCertificate.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingCertificate ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deleteCertificateId !== null}
        onOpenChange={() => setDeleteCertificateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Certificate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this certificate? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCertificate.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
