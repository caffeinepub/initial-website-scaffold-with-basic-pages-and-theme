import { useState } from 'react';
import { useGetAllCategories, useCreateCategory, useEditCategory, useDeleteCategory } from '../hooks/usePortfolioCategories';
import { useGetAllWorks, useAddPhotographyWork, useEditPhotographyWork, useDeletePhotographyWork } from '../hooks/usePhotographyWorks';
import { useAuthz } from '../hooks/useAuthz';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2, FolderPlus } from 'lucide-react';
import type { PortfolioCategory, PhotographyWork, CategoryId, WorkId } from '../backend';
import GroupedWorksSection from '../components/GroupedWorksSection';

type Route = '/' | '/about' | '/contact' | '/portfolio' | '/certificates';

interface PortfolioPageProps {
  navigate: (path: Route) => void;
}

export default function PortfolioPage({ navigate }: PortfolioPageProps) {
  const { isAuthenticated } = useAuthz();
  const { data: categories = [], isLoading: categoriesLoading } = useGetAllCategories();
  const { data: works = [], isLoading: worksLoading } = useGetAllWorks();

  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [selectedWork, setSelectedWork] = useState<PhotographyWork | null>(null);

  // Category management state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PortfolioCategory | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [deleteCategoryId, setDeleteCategoryId] = useState<CategoryId | null>(null);

  // Work management state
  const [workDialogOpen, setWorkDialogOpen] = useState(false);
  const [editingWork, setEditingWork] = useState<PhotographyWork | null>(null);
  const [workTitle, setWorkTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [workImageUrl, setWorkImageUrl] = useState('');
  const [workCategoryId, setWorkCategoryId] = useState<string>('');
  const [deleteWorkId, setDeleteWorkId] = useState<WorkId | null>(null);

  const createCategory = useCreateCategory();
  const editCategory = useEditCategory();
  const deleteCategory = useDeleteCategory();
  const addWork = useAddPhotographyWork();
  const editWork = useEditPhotographyWork();
  const deleteWork = useDeletePhotographyWork();

  const filteredWorks = selectedCategoryId
    ? works.filter((work) => work.categoryId === selectedCategoryId)
    : works;

  const handleOpenCategoryDialog = (category?: PortfolioCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
      setCategoryDescription(category.description);
    } else {
      setEditingCategory(null);
      setCategoryName('');
      setCategoryDescription('');
    }
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;

    if (editingCategory) {
      await editCategory.mutateAsync({
        id: editingCategory.id,
        name: categoryName,
        description: categoryDescription,
      });
    } else {
      await createCategory.mutateAsync({
        name: categoryName,
        description: categoryDescription,
      });
    }

    setCategoryDialogOpen(false);
    setEditingCategory(null);
    setCategoryName('');
    setCategoryDescription('');
  };

  const handleDeleteCategory = async () => {
    if (deleteCategoryId === null) return;
    await deleteCategory.mutateAsync(deleteCategoryId);
    setDeleteCategoryId(null);
    if (selectedCategoryId === deleteCategoryId) {
      setSelectedCategoryId(null);
    }
  };

  const handleOpenWorkDialog = (work?: PhotographyWork) => {
    if (work) {
      setEditingWork(work);
      setWorkTitle(work.title);
      setWorkDescription(work.description);
      setWorkImageUrl(work.imageUrl);
      setWorkCategoryId(work.categoryId.toString());
    } else {
      setEditingWork(null);
      setWorkTitle('');
      setWorkDescription('');
      setWorkImageUrl('');
      setWorkCategoryId(categories[0]?.id.toString() || '');
    }
    setWorkDialogOpen(true);
  };

  const handleSaveWork = async () => {
    if (!workTitle.trim() || !workImageUrl.trim() || !workCategoryId) return;

    const categoryId = BigInt(workCategoryId);

    if (editingWork) {
      await editWork.mutateAsync({
        id: editingWork.id,
        title: workTitle,
        description: workDescription,
        imageUrl: workImageUrl,
        categoryId,
      });
    } else {
      await addWork.mutateAsync({
        title: workTitle,
        description: workDescription,
        imageUrl: workImageUrl,
        categoryId,
      });
    }

    setWorkDialogOpen(false);
    setEditingWork(null);
    setWorkTitle('');
    setWorkDescription('');
    setWorkImageUrl('');
    setWorkCategoryId('');
  };

  const handleDeleteWork = async () => {
    if (deleteWorkId === null) return;
    await deleteWork.mutateAsync(deleteWorkId);
    setDeleteWorkId(null);
    setSelectedWork(null);
  };

  if (categoriesLoading || worksLoading) {
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
        <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
        <p className="text-lg text-muted-foreground">
          Explore my photography work organized by category
        </p>
      </div>

      {/* Management Section - Only visible to authenticated users */}
      {isAuthenticated && (
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle>Management</CardTitle>
            <CardDescription>Manage your portfolio categories and works</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="categories" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="works">Works</TabsTrigger>
              </TabsList>

              <TabsContent value="categories" className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {categories.length} {categories.length === 1 ? 'category' : 'categories'}
                  </p>
                  <Button onClick={() => handleOpenCategoryDialog()} size="sm">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>

                <div className="grid gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.id.toString()}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenCategoryDialog(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteCategoryId(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No categories yet. Create your first category to get started.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="works" className="space-y-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {works.length} {works.length === 1 ? 'work' : 'works'}
                  </p>
                  <Button
                    onClick={() => handleOpenWorkDialog()}
                    size="sm"
                    disabled={categories.length === 0}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Work
                  </Button>
                </div>

                {categories.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Create at least one category before adding works.
                  </p>
                ) : (
                  <div className="space-y-8">
                    {categories.map((category) => {
                      const categoryWorks = works.filter(
                        (work) => work.categoryId === category.id
                      );
                      return (
                        <GroupedWorksSection
                          key={category.id.toString()}
                          category={category}
                          works={categoryWorks}
                          onEditWork={handleOpenWorkDialog}
                          onDeleteWork={setDeleteWorkId}
                        />
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Public Gallery */}
      <div className="space-y-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategoryId === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategoryId(null)}
              size="sm"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id.toString()}
                variant={selectedCategoryId === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategoryId(category.id)}
                size="sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {/* Works Gallery */}
        {filteredWorks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorks.map((work) => (
              <Card
                key={work.id.toString()}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedWork(work)}
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{work.title}</CardTitle>
                  {work.description && (
                    <CardDescription className="line-clamp-2">
                      {work.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No works to display</h3>
              <p className="text-muted-foreground">
                {categories.length === 0
                  ? 'No categories have been created yet.'
                  : selectedCategoryId
                  ? 'No works in this category yet.'
                  : 'No photography works have been added yet.'}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Update the category details below.'
                : 'Add a new category to organize your photography works.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Landscapes"
              />
            </div>
            <div>
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                placeholder="Brief description of this category"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={!categoryName.trim() || createCategory.isPending || editCategory.isPending}
            >
              {createCategory.isPending || editCategory.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingCategory ? (
                'Update'
              ) : (
                'Create'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Work Dialog */}
      <Dialog open={workDialogOpen} onOpenChange={setWorkDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingWork ? 'Edit Work' : 'Add Work'}</DialogTitle>
            <DialogDescription>
              {editingWork
                ? 'Update the work details below.'
                : 'Add a new photography work to your portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="work-title">Title</Label>
              <Input
                id="work-title"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                placeholder="e.g., Sunset at the Beach"
              />
            </div>
            <div>
              <Label htmlFor="work-description">Description</Label>
              <Textarea
                id="work-description"
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
                placeholder="Describe your work"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="work-image-url">Image URL</Label>
              <Input
                id="work-image-url"
                value={workImageUrl}
                onChange={(e) => setWorkImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="work-category">Category</Label>
              <Select value={workCategoryId} onValueChange={setWorkCategoryId}>
                <SelectTrigger id="work-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id.toString()} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWorkDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveWork}
              disabled={
                !workTitle.trim() ||
                !workImageUrl.trim() ||
                !workCategoryId ||
                addWork.isPending ||
                editWork.isPending
              }
            >
              {addWork.isPending || editWork.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : editingWork ? (
                'Update'
              ) : (
                'Add'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={deleteCategoryId !== null} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This will also delete all works
              associated with this category. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategory.isPending ? (
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

      {/* Delete Work Confirmation */}
      <AlertDialog open={deleteWorkId !== null} onOpenChange={() => setDeleteWorkId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Work</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this work? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWork}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteWork.isPending ? (
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

      {/* Work Detail Dialog */}
      <Dialog open={selectedWork !== null} onOpenChange={() => setSelectedWork(null)}>
        <DialogContent className="max-w-4xl">
          {selectedWork && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedWork.title}</DialogTitle>
                <DialogDescription>
                  {categories.find((c) => c.id === selectedWork.categoryId)?.name || 'Unknown category'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="aspect-video overflow-hidden rounded-lg bg-muted">
                  <img
                    src={selectedWork.imageUrl}
                    alt={selectedWork.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                {selectedWork.description && (
                  <p className="text-muted-foreground">{selectedWork.description}</p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
