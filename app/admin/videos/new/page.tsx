import { VideoForm } from '@/components/admin/video-form';

export default function NewVideoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Add New Video</h1>
        <p className="text-muted-foreground mt-1">
          Add a new video to the gallery from YouTube or Vimeo.
        </p>
      </div>

      <VideoForm />
    </div>
  );
}
