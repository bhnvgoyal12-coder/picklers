export function PoliciesPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Policies</h1>

      {/* Refund Policy */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Refund & Cancellation Policy</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          All game bookings on Picklers are final. Once a player has registered and completed payment for a game,
          <strong> no refunds will be issued under any circumstances</strong>, including but not limited to:
        </p>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>Player unable to attend the game</li>
          <li>Schedule conflicts or personal emergencies</li>
          <li>Weather conditions (unless the game host cancels the game)</li>
          <li>Change of mind after registration</li>
        </ul>
        <p className="text-sm text-gray-700 leading-relaxed">
          If a game is cancelled by the host, the host is responsible for arranging any refunds directly with the
          registered players. Picklers acts only as a platform to facilitate game organization and payment collection.
        </p>
      </section>

      {/* Privacy Policy */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Privacy Policy</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Picklers collects and processes personal information solely for the purpose of facilitating pickleball
          game registrations and payments. The information we collect includes:
        </p>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>Name, email address, and phone number (provided during registration)</li>
          <li>Google account information (used for authentication)</li>
          <li>Payment transaction details (processed securely via Razorpay)</li>
        </ul>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">How We Use Your Information</h3>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>To register you for games and communicate game details</li>
          <li>To process payments securely through our payment partner</li>
          <li>To display your name to the game host and other players in the game</li>
        </ul>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Data Sharing</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          We do not sell or share your personal information with third parties, except as necessary to process
          payments (via Razorpay) and authenticate your account (via Google). Your contact details are visible
          only to the game host for coordination purposes.
        </p>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Data Security</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          We use industry-standard security measures to protect your data. All payment information is handled
          directly by Razorpay and is never stored on our servers.
        </p>

        <h3 className="text-sm font-semibold text-gray-900 pt-2">Contact</h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          For any questions regarding these policies, please contact the Picklers team.
        </p>
      </section>

      {/* Terms of Service */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">Terms of Service</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          By using Picklers, you agree to the following terms:
        </p>
        <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
          <li>You must provide accurate personal information when registering for games</li>
          <li>All payments are final and non-refundable as described in our Refund Policy</li>
          <li>Game hosts are responsible for organizing and conducting their games</li>
          <li>Picklers is a platform for coordination and payment collection only; we are not responsible for the games themselves</li>
          <li>You participate in games at your own risk</li>
        </ul>
      </section>
    </div>
  );
}
