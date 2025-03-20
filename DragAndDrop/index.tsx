'use client';

import useUploadTranslations from '@/app/(protected)/idr/upload/translations';
import { uploadFiles } from '@/app/api/files/uploadFiles';
import useToasterTranslations from '@/app/components/CustomToaster/translations';
import {
  FileWithStatus,
  MAX_SIZE_MB,
  StatusEnum,
  uploadFilesResponseItem
} from '@/app/lib/definitions';
import { isDuplicateFile, isValidFormat, removeNameTimestamp } from '@/app/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { ArrowPathIcon, CloudArrowUpIcon, TrashIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getSession } from 'next-auth/react';
import { ChangeEvent, DragEvent, useCallback, useState } from 'react';
import FileList from '../FileList/FileList';
import H1 from '../htmlTags/h1';

const validateFiles = (
  newFiles: File[],
  existingFiles: FileWithStatus[],
  toastTranslations: any
): FileWithStatus[] => {
  let totalSize = existingFiles.reduce((acc, file) => acc + file.file.size, 0);
  const validFiles: File[] = [];
  let hasInvalidFiles = false;
  let hasDuplicates = false;

  const existingFileMap = new Map(
    existingFiles.map((file) => [file.file.name + file.file.size, file])
  );

  for (const newFile of newFiles) {
    if (isDuplicateFile(newFile, existingFileMap)) {
      hasDuplicates = true;
    } else if (isValidFormat(newFile)) {
      totalSize += newFile.size;
      validFiles.push(newFile);
    } else {
      hasInvalidFiles = true;
    }
  }

  const totalSizeMB = totalSize / (1024 * 1024);
  if (totalSizeMB > MAX_SIZE_MB) {
    toast({
      description: `${toastTranslations.sizeError} ${MAX_SIZE_MB}MB.`,
      imageSrc: '/Toast-Error.svg'
    });
    return [];
  }

  if (hasInvalidFiles) {
    toast({ description: toastTranslations.invalidFiles, imageSrc: '/Toast-Alert.svg' });
  }

  if (hasDuplicates) {
    toast({ description: toastTranslations.duplicatedFiles, imageSrc: '/Toast-Alert.svg' });
  }

  return validFiles.map((file) => ({ file, status: StatusEnum.Pending }));
};

export default function DragAndDrop() {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [uploading, setUploading] = useState(false);

  const toastTranslations = useToasterTranslations();
  const t = useUploadTranslations();
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const droppedFiles = Array.from(event.dataTransfer.files);
      const validFiles = validateFiles(droppedFiles, files, toastTranslations);
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(event.target.files || []);
      const validFiles = validateFiles(selectedFiles, files, toastTranslations);
      setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const uploadFilesToBackend = async () => {
    const filesToUpload = files.filter(
      (file) => file.status === StatusEnum.Pending || file.status === StatusEnum.Failed
    );
    if (filesToUpload.length === 0) return;

    setUploading(true);

    try {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          filesToUpload.some(
            (uploadFile) =>
              uploadFile.file.name === file.file.name && uploadFile.file.size === file.file.size
          )
            ? { ...file, status: StatusEnum.Uploading }
            : file
        )
      );
      const session = await getSession();
      const response = await uploadFiles(
        filesToUpload.map(({ file }) => file),
        { token: session?.user?.id, expires: session?.expires }
      );

      let fileUploadFailed = false;

      setFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (
            filesToUpload.some(
              (fileToUpload) =>
                fileToUpload.file.name === file.file.name &&
                fileToUpload.file.size === file.file.size
            )
          ) {
            const uploadedFile: uploadFilesResponseItem = response.find(
              (uploadedFile: uploadFilesResponseItem) =>
                removeNameTimestamp(uploadedFile.name) === file.file.name &&
                uploadedFile.size === file.file.size
            );
            if (uploadedFile) {
              if (uploadedFile.status === 'OK') {
                return {
                  ...file,
                  status: StatusEnum.Uploaded
                };
              } else {
                fileUploadFailed = true;
                console.error(
                  `Error occurred while processing file: ${removeNameTimestamp(uploadedFile.name)}`,
                  'Upload Errors:',
                  uploadedFile.errors
                );

                return {
                  ...file,
                  status: StatusEnum.Failed
                };
              }
            }
          }
          return file;
        })
      );
      fileUploadFailed
        ? toast({ description: toastTranslations.uploadAlert, imageSrc: '/Toast-Alert.svg' })
        : toast({ description: toastTranslations.uploadSuccess, imageSrc: '/Toast-Success.svg' });
    } catch (error) {
      toast({ description: toastTranslations.uploadError, imageSrc: '/Toast-Error.svg' });
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          filesToUpload.some(
            (uploadFile) =>
              uploadFile.file.name === file.file.name && uploadFile.file.size === file.file.size
          )
            ? { ...file, status: StatusEnum.Failed }
            : file
        )
      );
    } finally {
      setUploading(false);
    }
  };

  const removeFile = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-center my-6 mx-11 space-y-4 sm:space-y-0">
        <H1>{t.pageTitle}</H1>
        <div className="flex space-x-2">
          <button
            onClick={clearFiles}
            disabled={files.length === 0 || uploading}
            className={clsx(
              'bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center space-x-2',
              {
                'cursor-not-allowed opacity-50': files.length === 0 || uploading
              }
            )}
          >
            <TrashIcon className="w-5" />
            <span>{t.clearFileButton}</span>
          </button>
          <button
            onClick={uploadFilesToBackend}
            disabled={files.length === 0 || uploading}
            className={clsx(
              'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center space-x-2',
              {
                'cursor-not-allowed opacity-50': files.length === 0 || uploading
              }
            )}
          >
            {uploading ? (
              <>
                <ArrowPathIcon className="w-5 animate-spin" />
                <span>{t.uploading}</span>
              </>
            ) : (
              <>
                <CloudArrowUpIcon className="w-5" />
                <span>{t.upload}</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="my-6 mx-11 p-6 border-2 border-dashed rounded-md border-blue-300 bg-blue-50 shadow-inner-custom-sm hover:shadow-inner-custom-md transition duration-300"
      >
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="text-center flex flex-col items-center gap-4 cursor-pointer"
          aria-label={t.uploadLabel}
        >
          <CloudArrowUpIcon className="w-20 text-blue-300" />
          <div>
            {t.uploadBoxDescription1}{' '}
            <span className="text-blue-300 underline cursor-pointer">
              {t.uploadBoxDescription2}
            </span>{' '}
            {t.uploadBoxDescription3}
          </div>
          <span className="text-gray-400 text-xs">{t.uploadLimit} 50MB • PDF, PNG, JPG, JPEG</span>
        </label>
      </div>
      {files.length > 0 && <FileList files={files} removeFile={removeFile} />}
    </>
  );
}
