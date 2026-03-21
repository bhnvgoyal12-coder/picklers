import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { Spinner } from '../components/ui/Spinner';

export function ProfilePage() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) return <Spinner className="py-20" />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), phone: phone.trim() })
      .eq('id', user!.id);

    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
        {/* Avatar + email */}
        <div className="flex items-center gap-4 mb-6">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className="w-14 h-14 rounded-full"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-xl font-bold">
              {(profile?.full_name || user?.email || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium text-gray-900">{profile?.full_name || 'User'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={user?.email ?? ''} disabled className={`${inputClass} bg-gray-50 text-gray-400`} />
          </div>

          {saved && (
            <p className="text-sm text-emerald-600 font-medium">Profile updated!</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <button
          onClick={signOut}
          className="w-full mt-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
