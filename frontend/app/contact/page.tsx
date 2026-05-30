import Layout from "@/components/Layout";

export const metadata = {
  title: "Contact",
  description:
    "Get in touch with TheClinicalRef for general questions, content corrections, or privacy requests. TheClinicalRef is an educational clinical reference, not medical advice.",
};

export default function ContactPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          Contact
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          TheClinicalRef is an independent, free clinical reference. We read every
          message, though as a small project it may take a few days to reply.
        </p>

        <div
          role="note"
          className="mt-8 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950 p-4 text-sm text-yellow-800 dark:text-yellow-300"
        >
          <p className="font-medium">This is a reference, not medical advice.</p>
          <p className="mt-1">
            We cannot provide clinical guidance, dosing recommendations, or answers
            about specific patients. In an emergency, call 911 or your local
            emergency number. Always verify against your own protocols, medical
            direction, and authoritative sources before acting on any information.
          </p>
        </div>

        <section className="mt-10 space-y-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              General questions &amp; feedback
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Suggestions, questions about the site, or advertising and partnership
              inquiries.
            </p>
            <a
              href="mailto:contact@theclinicalref.com"
              className="mt-2 inline-block font-medium text-red-700 dark:text-red-400 hover:underline"
            >
              contact@theclinicalref.com
            </a>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Report a content error
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Accuracy matters. If something looks wrong or out of date, tell us the
              page and what should change and we&apos;ll review it.
            </p>
            <a
              href="mailto:contact@theclinicalref.com?subject=Content%20correction"
              className="mt-2 inline-block font-medium text-red-700 dark:text-red-400 hover:underline"
            >
              contact@theclinicalref.com
            </a>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              Privacy requests
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Questions about your data or our{" "}
              <a
                href="/privacy"
                className="font-medium text-red-700 dark:text-red-400 hover:underline"
              >
                privacy policy
              </a>
              .
            </p>
            <a
              href="mailto:privacy@theclinicalref.com"
              className="mt-2 inline-block font-medium text-red-700 dark:text-red-400 hover:underline"
            >
              privacy@theclinicalref.com
            </a>
          </div>
        </section>
      </div>
    </Layout>
  );
}
