import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          My Blog
        </Link>
        <nav className="flex gap-6">
          <Link
            href="/"
            className="text-lg font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/post/manage"
            className="text-lg font-semibold text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
            Management
          </Link>
        </nav>
      </div>
    </header>
  );
};
