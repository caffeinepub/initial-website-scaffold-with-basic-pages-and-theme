import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { PortfolioCategory, PhotographyWork, WorkId } from '../backend';
import WorkThumbnailHoverInfo from './WorkThumbnailHoverInfo';

interface GroupedWorksSectionProps {
  category: PortfolioCategory;
  works: PhotographyWork[];
  onEditWork: (work: PhotographyWork) => void;
  onDeleteWork: (workId: WorkId) => void;
}

export default function GroupedWorksSection({
  category,
  works,
  onEditWork,
  onDeleteWork,
}: GroupedWorksSectionProps) {
  return (
    <div className="space-y-4">
      {/* Category Header */}
      <div className="border-b pb-3">
        <h3 className="text-xl font-semibold">{category.name}</h3>
        {category.description && (
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        )}
      </div>

      {/* Works Grid */}
      {works.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work) => (
            <div key={work.id.toString()} className="space-y-2">
              <WorkThumbnailHoverInfo
                work={work}
                categoryName={category.name}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditWork(work)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteWork(work.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <p className="text-center text-muted-foreground">
            No works in this category yet. Add your first work to get started.
          </p>
        </Card>
      )}
    </div>
  );
}
