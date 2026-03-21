import { useState } from 'react';
import type { Game } from '../../types';

type GameFormData = Omit<Game, 'id' | 'created_at' | 'updated_at' | 'spots_taken' | 'registrations'>;

interface GameFormProps {
  initialValues?: Partial<GameFormData>;
  onSubmit: (data: GameFormData) => Promise<void>;
  loading?: boolean;
}

export function GameForm({ initialValues, onSubmit, loading }: GameFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [date, setDate] = useState(initialValues?.date ?? '');
  const [startTime, setStartTime] = useState(initialValues?.start_time ?? '');
  const [endTime, setEndTime] = useState(initialValues?.end_time ?? '');
  const [locationName, setLocationName] = useState(initialValues?.location_name ?? '');
  const [locationAddress, setLocationAddress] = useState(initialValues?.location_address ?? '');
  const [locationMapUrl, setLocationMapUrl] = useState(initialValues?.location_map_url ?? '');
  const [courtInfo, setCourtInfo] = useState(initialValues?.court_info ?? '');
  const [maxPlayers, setMaxPlayers] = useState(initialValues?.max_players ?? 8);
  const [priceRupees, setPriceRupees] = useState(
    initialValues?.price_per_player ? initialValues.price_per_player / 100 : 0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      date,
      start_time: startTime,
      end_time: endTime,
      location_name: locationName.trim(),
      location_address: locationAddress.trim(),
      location_map_url: locationMapUrl.trim(),
      court_info: courtInfo.trim(),
      max_players: maxPlayers,
      price_per_player: Math.round(priceRupees * 100),
      currency: 'INR',
      status: 'upcoming',
    });
  };

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Title *</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Saturday Morning Doubles" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any additional details..." rows={2} className={inputClass} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Date *</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Start Time *</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>End Time *</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Location Name *</label>
        <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} required placeholder="e.g., Central Park Courts" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <input type="text" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} placeholder="Full address" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Google Maps Link</label>
        <input type="url" value={locationMapUrl} onChange={(e) => setLocationMapUrl(e.target.value)} placeholder="https://maps.google.com/..." className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Court Info</label>
        <input type="text" value={courtInfo} onChange={(e) => setCourtInfo(e.target.value)} placeholder="e.g., Court 3 & 4, Indoor" className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Max Players *</label>
          <input type="number" value={maxPlayers} onChange={(e) => setMaxPlayers(Number(e.target.value))} min={2} max={100} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Price per Player (₹)</label>
          <input type="number" value={priceRupees} onChange={(e) => setPriceRupees(Number(e.target.value))} min={0} step={1} className={inputClass} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold text-base hover:bg-emerald-700 disabled:opacity-50 active:scale-[0.98] transition-all"
      >
        {loading ? 'Saving...' : initialValues ? 'Update Game' : 'Create Game'}
      </button>
    </form>
  );
}
