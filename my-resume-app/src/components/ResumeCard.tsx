export default function ResumeCard({
  userId,
  content,
  fileUrl,
  jobType,
  createdAt,
}: {
  userId: string;
  content?: string;
  fileUrl?: string;
  jobType: string;
  createdAt: Date | string;
}) {
  return (
    <div className="border p-4 mb-3 rounded shadow-sm bg-white">
      <p className="text-sm text-gray-500">{userId}</p>
      {fileUrl && (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          View File
        </a>
      )}
      {content && (
        <p className="mt-2 text-gray-700 text-sm">
          {content.slice(0, 200)}...
        </p>
      )}
      <div className="text-xs text-gray-400 mt-2">
        {jobType} • {new Date(createdAt).toLocaleString()}
      </div>
    </div>
  );
}
