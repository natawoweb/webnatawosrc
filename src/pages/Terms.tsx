export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Use</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using NATAWO's website and services, you accept and agree to be bound by these Terms of Use. 
            If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
          <p>As a user of our platform, you agree to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
            <li>Respect intellectual property rights</li>
            <li>Follow our community guidelines</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Content Guidelines</h2>
          <p>When submitting content to our platform, you must ensure that:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>You own or have the right to share the content</li>
            <li>The content does not violate any laws or regulations</li>
            <li>The content follows our community standards</li>
          </ul>
        </section>
      </div>
    </div>
  );
}