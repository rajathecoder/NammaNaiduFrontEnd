import React from 'react';
import type { HoroscopeData } from '../types';

interface HoroscopeModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: HoroscopeData;
    onChange: (data: HoroscopeData) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
}

const HoroscopeModal: React.FC<HoroscopeModalProps> = ({
    isOpen,
    onClose,
    data,
    onChange,
    onSubmit,
}) => {
    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange({ ...data, [name]: value });
    };

    const RASI_OPTIONS = [
        "Mesham (Aries)",
        "Rishabham (Taurus)",
        "Mithunam (Gemini)",
        "Katakam (Cancer)",
        "Simmam (Leo)",
        "Kanni (Virgo)",
        "Thulaam (Libra)",
        "Vrischikam (Scorpio)",
        "Dhanusu (Sagittarius)",
        "Makaram (Capricorn)",
        "Kumbam (Aquarius)",
        "Meenam (Pisces)"
    ];

    const NATCHATHIRAM_OPTIONS = [
        "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha", "Ardra",
        "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
        "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
        "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
        "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
    ];

    const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
    const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
    const PERIODS = ['AM', 'PM'];

    // Helper to parse time string into parts
    const parseTime = (timeStr: string) => {
        if (!timeStr) return { hour: '', minute: '', period: 'AM' };

        // Try parsing "HH:mm" (24-hour) format
        const twentyFourHourMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
        if (twentyFourHourMatch) {
            let h = parseInt(twentyFourHourMatch[1], 10);
            const m = twentyFourHourMatch[2];
            const p = h >= 12 ? 'PM' : 'AM';
            if (h > 12) h -= 12;
            if (h === 0) h = 12;
            return { hour: String(h).padStart(2, '0'), minute: m, period: p };
        }

        // Try parsing "hh:mm AM/PM" format
        const twelveHourMatch = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
        if (twelveHourMatch) {
            return {
                hour: String(twelveHourMatch[1]).padStart(2, '0'),
                minute: twelveHourMatch[2],
                period: twelveHourMatch[3].toUpperCase()
            };
        }

        return { hour: '', minute: '', period: 'AM' };
    };

    const { hour, minute, period } = parseTime(data.birthTime || '');

    const handleTimeChange = (field: 'hour' | 'minute' | 'period', value: string) => {
        let newHour = field === 'hour' ? value : hour;
        let newMinute = field === 'minute' ? value : minute;
        let newPeriod = field === 'period' ? value : period;

        // If other fields are empty, set defaults when user interacts
        if (!newHour && field !== 'hour') newHour = '12';
        if (!newMinute && field !== 'minute') newMinute = '00';

        // Construct new time string
        // We'll save it as "hh:mm AA" (e.g. "02:30 PM") format
        if (newHour && newMinute && newPeriod) {
            const timeString = `${newHour}:${newMinute} ${newPeriod}`;
            onChange({ ...data, birthTime: timeString });
        }
    };

    return (
        <div
            className="fixed inset-0 bg-transparent bg-opacity-30 flex items-center justify-center z-[2000] p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Add Horoscope Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-3xl font-light w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        ×
                    </button>
                </div>
                <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rasi
                        </label>
                        <select
                            name="rasi"
                            value={data.rasi}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select Rasi</option>
                            {RASI_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Natchathiram
                        </label>
                        <select
                            name="natchathiram"
                            value={data.natchathiram}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                        >
                            <option value="">Select Natchathiram</option>
                            {NATCHATHIRAM_OPTIONS.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birth Place
                        </label>
                        <input
                            type="text"
                            name="birthPlace"
                            value={data.birthPlace}
                            onChange={handleChange}
                            placeholder="Enter Birth Place"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Birth Time
                        </label>
                        <div className="flex gap-2">
                            <select
                                value={hour}
                                onChange={(e) => handleTimeChange('hour', e.target.value)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                                <option value="">Hr</option>
                                {HOURS.map((h) => (
                                    <option key={h} value={h}>{h}</option>
                                ))}
                            </select>
                            <span className="self-center text-gray-500 font-bold">:</span>
                            <select
                                value={minute}
                                onChange={(e) => handleTimeChange('minute', e.target.value)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                                <option value="">Min</option>
                                {MINUTES.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <select
                                value={period}
                                onChange={(e) => handleTimeChange('period', e.target.value)}
                                className="w-24 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                                {PERIODS.map((p) => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-[#a413ed] to-[#8b10c9] text-white rounded-lg hover:shadow-lg transition-all font-medium"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HoroscopeModal;

