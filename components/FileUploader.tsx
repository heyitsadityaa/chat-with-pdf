"use client";
import { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import useUpload, { StatusText } from "@/hooks/useUpload";
import { useRouter } from "next/navigation";
import useSubscriptions from "@/hooks/useSubscriptions";
import { toast } from "./ui/use-toast";

const FileUploader = () => {
  const { progress, status, fileId, handleUpload } = useUpload();
  const router = useRouter();
  const { isOverFileLimit, filesLoading } = useSubscriptions();

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Do something with the files

      const file = acceptedFiles[0];
      if (file) {
        if (!isOverFileLimit && !filesLoading) {
          await handleUpload(file);
        } else {
          toast({
            variant: "destructive",
            title: "Free Plan File Limit Reached",
            description:
              "You have reached the maximum number of files allowed for your account. Please upgrade to add more documents.",
          });
        }
      } else {
        // do nothing...
        // toast...
      }
    },
    [handleUpload, isOverFileLimit, filesLoading]
  );

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: <RocketIcon className="h-20 w-20 text-sky-500" />,
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className="h-20 w-20 text-sky-500" />
    ),
    [StatusText.SAVING]: <SaveIcon className="h-20 w-20 text-sky-500" />,
    [StatusText.GENERATING]: (
      <HammerIcon className="h-20 w-20 text-sky-500 animate-bounce" />
    ),
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress <= 100;

  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-sky-300 text-white border-sky-500 border-4 ${
              progress === 100 && "hidden"
            } `}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": "12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          {/* Render Status Icon */}

          {
            // @ts-ignore
            statusIcons[status!]
          }

          {/* @ts-ignore */}
          <p className="text-sky-500 animate-pulse">{status}</p>
        </div>
      )}
      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-sky-500 text-sky-500 border-2 border-dashed mt-10 w-[90%] rounded-lg h-96 flex items-center justify-center ${
            isFocused || isDragAccept ? "bg-sky-300" : "bg-sky-100"
          } `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-20 w-20 animate-ping" />
                <p>Drop the files here ...</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="h-20 w-20 animate-bounce" />
                <p>Drag n drop some files here, or click to select files</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
