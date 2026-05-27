import Image from "next/image";

export default function Contact() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start bg-white dark:bg-black px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <h1 className="text-4xl font-bold mb-4">Locate Us</h1>
              <div className="relative w-full h-56 sm:h-96">
                <Image
                  src="/temp_map.jpg"
                  alt="Map showing Fuzz Butts location at 1521 W Dobbins Rd, Phoenix, AZ 85041"
                  fill
                  className="object-cover rounded"
                />
              </div>
              <p className="text-lg text-gray-700 mt-6 mb-6">
                Our shelter is located at 1521 W Dobbins Rd, Phoenix, AZ 85041.
                We are open for visits from 10am to 6pm every day. We would love
                to see you and introduce you to our adorable cats!
              </p>
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-lg text-gray-700 mb-6">
                If you have any questions or inquiries, please feel free to
                reach out to us. We are here to help and would love to hear from
                you!
              </p>
              <p className="text-lg text-gray-700 mb-6">
                You can contact us via email at{" "}
                <a href="mailto:info@fuzzbutts.org" className="text-blue-500">
                  info@fuzzbutts.org
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
