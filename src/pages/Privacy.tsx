
export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <div className="mb-6">
          <p className="text-lg font-medium">North America Tamil Writers Organization (NATAWO)</p>
          <p className="text-muted-foreground">Effective Date: February 14, 2025</p>
          <p className="text-muted-foreground">Last Updated: February 19, 2025</p>
        </div>
        
        <p className="mb-6">
          North America Tamil Writers Organization (NATAWO) respects your privacy and is committed to protecting your personal information. 
          This Privacy Policy outlines how we collect, use, disclose, and protect your data when you access our website, engage in forums, 
          or participate in our programs.
        </p>

        <p className="mb-8">
          By using our website, you agree to the practices described in this Privacy Policy. If you do not agree with the terms, 
          please discontinue use of our services.
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
          
          <h3 className="text-xl font-medium mb-3">A. Personal Information (Voluntarily Provided by Users)</h3>
          <p className="mb-4">We collect personal information when you:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Register for an account on our website.</li>
            <li>Participate in forums, discussions, or submit literary works.</li>
            <li>Subscribe to our newsletter, events, or membership programs.</li>
            <li>Contact us for support, feedback, or inquiries.</li>
          </ul>
          
          <p className="mb-4">This information may include:</p>
          <ul className="list-disc pl-6 mb-6">
            <li>Full name</li>
            <li>Email address</li>
            <li>Username and password</li>
            <li>Profile information (e.g., biography, interests, published works)</li>
            <li>Payment information (for event registration, donations, or membership fees)</li>
            <li>Any content, comments, or messages submitted to forums or discussions</li>
          </ul>

          <h3 className="text-xl font-medium mb-3">B. Information Collected Automatically</h3>
          <p className="mb-4">When you use our website, certain information is collected automatically through cookies and analytics tools:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>IP Address & Device Information – To improve website security and optimize performance.</li>
            <li>Browser & Operating System Details – To ensure compatibility with our platform.</li>
            <li>Usage Data – Pages visited, time spent, and interactions on the website.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Legal Basis for Collecting Information</h2>
          <p className="mb-4">We process personal information under the following legal bases:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Legitimate Interest – To provide services such as forums, community engagement, and user interactions.</li>
            <li>Consent – When users voluntarily submit personal data for newsletters, memberships, or event registrations.</li>
            <li>Contractual Necessity – For processing payments, event sign-ups, and service-related communication.</li>
            <li>Legal Compliance – To comply with applicable laws, regulations, or legal obligations.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
          <p className="mb-4">We use collected information for:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>User Account Management – To create and maintain user accounts.</li>
            <li>Community Engagement – Facilitating discussions, forums, and collaborations.</li>
            <li>Service Improvement – Enhancing website functionality, user experience, and content recommendations.</li>
            <li>Event Management – Organizing literary events, workshops, and writing competitions.</li>
            <li>Security & Fraud Prevention – Detecting unauthorized activities and protecting user data.</li>
            <li>Legal & Compliance Requirements – Responding to legal requests and regulatory requirements.</li>
          </ul>
          <p>We do not use personal information for automated decision-making or profiling.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Contact Information</h2>
          <p className="mb-4">
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
          </p>
          <p className="flex items-center gap-2">
            <span>📧 Email:</span>
            <a href="mailto:natawomail@gmail.com" className="text-primary hover:underline">
              natawomail@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
