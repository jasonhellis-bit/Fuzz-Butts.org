export default function About() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start bg-white dark:bg-black px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
                <div className="w-full sm:w-1/3">
                  <img
                    src="/fuzz_butts_founder.jpg"
                    alt="Fuzz Butts founder"
                    className="h-auto w-full rounded-3xl object-cover shadow-xl"
                  />
                </div>
                <div className="w-full sm:w-2/3">
                  <h1 className="text-4xl font-bold mb-4">Lorem Ipsum</h1>
                  <p className="text-lg text-gray-700 mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco
                    laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                    irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum. Lorem
                    ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Curabitur pretium tincidunt lacus. Nulla gravida orci a
                    odio. Nullam varius, turpis et commodo pharetra, est eros
                    bibendum elit, nec luctus magna felis sollicitudin mauris.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Curabitur pretium tincidunt lacus. Nulla gravida orci a
                    odio. Nullam varius, turpis et commodo pharetra, est eros
                    bibendum elit, nec luctus magna felis sollicitudin mauris.
                  </p>
                  <p className="text-lg text-gray-700 mb-6">
                    Curabitur pretium tincidunt lacus. Nulla gravida orci a
                    odio. Nullam varius, turpis et commodo pharetra, est eros
                    bibendum elit, nec luctus magna felis sollicitudin mauris.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
