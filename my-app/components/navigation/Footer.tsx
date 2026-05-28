export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 text-sm text-gray-500">
      <div className="relative flex items-center px-6">
        <a
          href="https://www.linkedin.com/company/web-by-ellis/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0">
          <img
            src="/web-by-ellis-icon.svg"
            alt="Web by Ellis"
            className="h-8 w-auto sm:hidden"
          />
          <img
            src="/web-by-ellis-logo.svg"
            alt="Web by Ellis Logo"
            className="hidden sm:block h-16 w-auto"
          />
        </a>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p>&copy; {new Date().getFullYear()} Fuzz Butts. All rights reserved.</p>
          <p>Fuzz Butts is a registered 501(c)(3) charitable organization.</p>
        </div>
      </div>
    </footer>
  );
}
