export default function Contact() {
  return (
    <div className="min-h-screen w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-start bg-white dark:bg-black px-6 py-8 sm:px-16">
        <div className="w-full flex-1 pt-8">
          <div className="mx-auto flex w-full justify-center px-2 sm:px-0">
            <div className="w-full max-w-5xl">
              <h1 className="text-4xl font-bold mb-4">Locate Us</h1>
              <div>
                {/* put a map here and center on the address: 1521 W Dobbins Rd, Phoenix, AZ 85041 */}
                <iframe
                  title="Fuzz Butts Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1234567890123!2d-112.1234567890123!3d33.1234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x872b123456789012%3A0x1234567890123456!2s1521%20W%20Dobbins%20Rd%2C%20Phoenix%2C%20AZ%2085041!5e0!3m2!1sen!2sus!4v1234567890123"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
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
