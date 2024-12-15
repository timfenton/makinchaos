'use client';

import { Trash, UploadIcon } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import Dropzone, { type DropzoneProps, type FileRejection } from 'react-dropzone';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useControllableState } from '@/hooks/use-controllable-state';
import { cn, formatBytes } from '@/lib/utils';

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader, now URLs of uploaded files.
   * @type string[]
   */
  value?: string[] | string;

  /**
   * Function to be called when the value changes.
   * @type React.Dispatch<React.SetStateAction<string[]>>
   */
  onValueChange?: React.Dispatch<React.SetStateAction<string[] | string>>;

  /**
   * Function to be called when files are uploaded.
   * Resolves to URLs of the uploaded files.
   * @type (files: File[]) => Promise<string[]>
   */
  onUpload?: (files: File[] | File) => Promise<string[] | string>;

  progresses?: Record<string, number>;
  accept?: DropzoneProps['accept'];
  maxSize?: DropzoneProps['maxSize'];
  maxFiles?: DropzoneProps['maxFiles'];
  multiple?: boolean;
  disabled?: boolean;
}

export function FileUploader({
  value: valueProp,
  onValueChange,
  onUpload,
  progresses,
  accept = { 'image/*': [] },
  maxSize = 1024 * 1024 * 2,
  maxFiles = 1,
  multiple = false,
  disabled = false,
  className,
  ...dropzoneProps
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<File[]>([]);

  const [urls, setUrls] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  // Sync files from URLs when editing
  React.useEffect(() => {
    if (urls) {
      const newFiles = Array.isArray(urls)
        ? urls.map((url, index) => createFileFromUrl(url, index))
        : [createFileFromUrl(urls, 0)];
      setFiles(newFiles);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = React.useCallback(
    async (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error('Cannot upload more than 1 file at a time');
        return;
      }

      if ((files.length + acceptedFiles.length) > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setFiles((prev) => {
        if (prev.length === 1 && !multiple) {
          return newFiles;
        }
        return [...prev, ...newFiles];
      });

      if (onUpload) {
        try {
          const uploadedUrls = await onUpload(newFiles);
          setUrls((prevUrls) => {
            if (!multiple && prevUrls?.length === 1) {
              return uploadedUrls;
            }
            return [...(prevUrls || []), ...uploadedUrls];
          });
        } catch {
          toast.error('File upload failed');
        }
      }

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }
    },
    [files, maxFiles, multiple, onUpload, setUrls]
  );

  const onRemove = (index: number) => {
    if (!urls) return;

    const updatedUrls = Array.isArray(urls) ? urls.filter((_, i) => i !== index) : urls;

    console.log(`removed ${index} and the new urls are ${updatedUrls}`);

    setUrls(updatedUrls);

    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index)

      console.log(`removed ${index} files and new files are ${updatedFiles}`)

      return updatedFiles;
    });
  };

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      {files.length < 1 && <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFiles}
        multiple={multiple}
        disabled={disabled || files.length >= maxFiles}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25',
              isDragActive && 'border-muted-foreground/50',
              disabled && 'pointer-events-none opacity-60',
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            <UploadIcon
              className="size-7 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        )}
      </Dropzone>}
      {files.length > 0 && (
        <ScrollArea className="h-fit w-full px-3">
          <div className="max-h-48 space-y-4">
            {files.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                url={urls?.[index]}
                onRemove={() => onRemove(index)}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

// Helper function to create a File-like object from URL
function createFileFromUrl(url: string, index: number): File {
  const filename = `file-${index}-${url.split('/').pop() || 'unknown'}`;

  const newFile = Object.assign(new File([], filename, { type: 'image/*' }), {
    preview: url,
  })

  return newFile;
}

interface FileCardProps {
  file: File;
  url?: string;
  progress?: number;
  onRemove: () => void;
}

function FileCard({ file, url, progress, onRemove }: FileCardProps) {
  return (
    <div className="relative flex items-center space-x-4">
      <div className="flex flex-1 space-x-4">
        {isFileWithPreview(file) && (
          <Image
            src={file.preview}
            alt={file.name}
            width={25}
            height={25}
            loading="lazy"
            className="aspect-square shrink-0 rounded-md object-cover"
          />
        )}
        <div className="flex w-full flex-col gap-2">
          <p className="line-clamp-1 text-sm font-medium text-foreground/80">
            {url || file.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatBytes(file.size)}
          </p>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <Button
        type="button"
        variant="destructive"
        size="icon"
        className="size-7"
        onClick={onRemove}
      >
        <Trash className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return 'preview' in file && typeof file.preview === 'string';
}
