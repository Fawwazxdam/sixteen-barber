"use client";

interface FormCardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export function FormCard({ 
  title, 
  description, 
  children, 
  onSubmit,
  className = ""
}: FormCardProps) {
  return (
    <div className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-8 ${className}`}>
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
      </form>
    </div>
  );
}