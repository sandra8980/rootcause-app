import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

export default function RootCauseApp() {
  const [step, setStep] = useState('landing');
  const [observation, setObservation] = useState('');
  const [saving, setSaving] = useState(false);

  const getSupabase = () => {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || ''
    );
  };

  const handleStart = () => setStep('investigate');

  const handleSave = async () => {
    setSaving(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('cases').insert([
        { initial_symptom: observation }
      ]);
      if (error) throw error;
      alert('Investigation saved to Supabase successfully!');
    } catch (err) {
      alert('Error saving case: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {step === 'landing' && (
        <div style={{ textAlign: 'center', paddingTop: '60px' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>
            Don't just find the damage. Find what caused it.
          </h1>
          <p style={{ color: '#555', fontSize: '1.1rem', marginBottom: '30px' }}>
            RootCause helps contractors and inspectors investigate underlying causes before repairing the wrong thing.
          </p>
          <button 
            onClick={handleStart} 
            style={{ backgroundColor: '#2563eb', color: '#fff', padding: '16px 32px', fontSize: '1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Start an Investigation
          </button>
        </div>
      )}

      {step === 'investigate' && (
        <div>
          <h2>New Property Investigation</h2>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Describe or upload what you see:
          </label>
          <textarea 
            value={observation} 
            onChange={(e) => setObservation(e.target.value)} 
            rows="4" 
            style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '6px', border: '1px solid #ccc' }}
            placeholder="e.g., Water stain on top floor ceiling after rainfall..."
          />
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ backgroundColor: '#16a34a', color: '#fff', padding: '12px 24px', fontSize: '1rem', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '15px' }}>
            {saving ? 'Saving...' : 'Save Case to Database'}
          </button>
        </div>
      )}
    </div>
  );
}
