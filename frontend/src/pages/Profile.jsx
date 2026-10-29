import { useState, useEffect } from 'react';
import { profileAPI } from '../services/api';
import ProfileSection from '../components/ProfileSection';
import EditDemographicsModal from '../components/EditDemographicsModal';
import EditConditionsModal from '../components/EditConditionsModal';
import EditSymptomsModal from '../components/EditSymptomsModal';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await profileAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      setSuccess('');
      setError('');

      const response = await profileAPI.updateProfile(updatedData);

      setProfile(response.data);
      setSuccess('Your health profile has been updated successfully!');
      setActiveModal(null);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
      console.error(err);
    }
  };

  useEffect(() => {
    // The initial request synchronizes component state with the API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-7 w-7 text-blue-600"
            aria-hidden="true"
          >
            <path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="mt-5 text-sm font-semibold text-slate-700">
          Loading your health profile...
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Getting your information ready
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-[70vh] bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-red-900/5 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-8 w-8"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5m0 3h.01" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Unable to load your profile
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error || 'Something went wrong while loading your health information.'}
          </p>

          <button
            type="button"
            onClick={fetchProfile}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M20 7v5h-5M4 17v-5h5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.6 9a7 7 0 0 1 11.7-2L20 12M4 12l2.7 5a7 7 0 0 0 11.7-2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Try again
          </button>
        </div>
      </main>
    );
  }

  const personalProfile = profile.profile || {};
  const healthProfile = profile.healthProfile || {};

  const fullName = [
    personalProfile.firstName,
    personalProfile.lastName,
  ]
    .filter(Boolean)
    .join(' ');

  const sections = [
    {
      label: 'Known conditions',
      count: healthProfile.conditions?.length || 0,
      icon: '🏥',
    },
    {
      label: 'Allergies',
      count: healthProfile.allergies?.length || 0,
      icon: '⚠️',
    },
    {
      label: 'Medications',
      count: healthProfile.medications?.length || 0,
      icon: '💊',
    },
    {
      label: 'Recent symptoms',
      count: healthProfile.symptoms?.length || 0,
      icon: '🩺',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-sky-50/70 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-sky-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-[30rem] h-96 w-96 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Page heading */}
        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                PERSONAL HEALTH CENTER
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem]">
                My Health <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Profile</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Your personal health information, all in one place. Keep your
                details up to date for a more personalized experience.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-lg font-bold uppercase text-white shadow-md shadow-blue-600/20">
                {fullName
                  ? fullName.charAt(0)
                  : profile.email?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="max-w-48 truncate text-sm font-bold text-slate-800">
                  {fullName || 'Your profile'}
                </p>
                <p className="max-w-48 truncate text-xs text-slate-500">
                  {profile.email || 'HealthAssist member'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Profile overview banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-6 text-white shadow-xl shadow-blue-900/10 sm:p-8 lg:p-9">
          <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border-[35px] border-white/[0.08]" />
          <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-cyan-300/10 blur-2xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 shadow-inner">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path
                    d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m9 12 2 2 4-4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h2 className="mt-5 text-2xl font-bold tracking-tight sm:text-3xl">
                {fullName ? `Welcome, ${fullName}!` : 'Your health, your story.'}
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-blue-50 sm:text-base">
                A well-maintained health profile helps you keep important
                information organized and provides context for your HealthAssist
                experience.
              </p>

              <button
                type="button"
                onClick={() => setActiveModal('demographics')}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-lg shadow-blue-950/10 transition-all hover:-translate-y-0.5 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path
                    d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Edit personal details
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {sections.map((section) => (
                <div
                  key={section.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white/[0.16] sm:p-5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xl" aria-hidden="true">
                      {section.icon}
                    </span>
                    <span className="text-2xl font-extrabold tabular-nums sm:text-3xl">
                      {section.count}
                    </span>
                  </div>
                  <p className="mt-3 text-xs font-medium leading-5 text-blue-50 sm:text-sm">
                    {section.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success message */}
        {success && (
          <div
            role="status"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="m8 12 2.5 2.5L16 9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-sm font-bold">Changes saved</p>
              <p className="mt-1 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800 shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path
                d="M12 8v5m0 3h.01"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Section heading */}
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Your health information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View and manage your personal and medical details.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-4 w-4 text-blue-600"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path
                d="m9 12 2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Personal health information
          </span>
        </div>

        {/* Health information cards */}
        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
          <ProfileSection
            title="Personal Information"
            icon="👤"
            onEdit={() => setActiveModal('demographics')}
          >
            <div className="space-y-0 divide-y divide-slate-100">
              <InfoRow
                label="Full name"
                value={fullName || 'Not set'}
                icon="user"
              />
              <InfoRow
                label="Email address"
                value={profile.email || 'Not set'}
                icon="mail"
              />
              <InfoRow
                label="Date of birth"
                value={
                  personalProfile.dateOfBirth
                    ? new Date(personalProfile.dateOfBirth).toLocaleDateString(
                        undefined,
                        {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }
                      )
                    : 'Not set'
                }
                icon="calendar"
              />
              <InfoRow
                label="Gender"
                value={personalProfile.gender || 'Not set'}
                icon="user-round"
              />
              <InfoRow
                label="Phone"
                value={personalProfile.phone || 'Not set'}
                icon="phone"
              />
              <InfoRow
                label="Address"
                value={personalProfile.address || 'Not set'}
                icon="map-pin"
              />
            </div>
          </ProfileSection>

          <ProfileSection
            title="Known Conditions"
            icon="🏥"
            onEdit={() => setActiveModal('conditions')}
          >
            <ArrayDisplay
              items={healthProfile.conditions || []}
              emptyMessage="No conditions reported"
              description="Medical conditions you've added to your profile."
              theme="blue"
            />
          </ProfileSection>

          <ProfileSection
            title="Allergies"
            icon="⚠️"
            onEdit={() => setActiveModal('allergies')}
          >
            <ArrayDisplay
              items={healthProfile.allergies || []}
              emptyMessage="No allergies reported"
              description="Keep known allergies recorded for reference."
              theme="orange"
            />
          </ProfileSection>

          <ProfileSection
            title="Current Medications"
            icon="💊"
            onEdit={() => setActiveModal('medications')}
          >
            <ArrayDisplay
              items={healthProfile.medications || []}
              emptyMessage="No medications reported"
              description="Medications you've added to your health profile."
              theme="purple"
            />
          </ProfileSection>

          <ProfileSection
            title="Recent Symptoms"
            icon="🩺"
            onEdit={() => setActiveModal('symptoms')}
            fullWidth
          >
            <SymptomsDisplay symptoms={healthProfile.symptoms || []} />
          </ProfileSection>

          <ProfileSection
            title="Medical History"
            icon="📋"
            onEdit={() => setActiveModal('history')}
            fullWidth
          >
            <HistoryDisplay history={healthProfile.medicalHistory || []} />
          </ProfileSection>
        </div>

        {/* Privacy note */}
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/75 p-4 shadow-sm sm:items-center sm:p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
              <path
                d="m9 12 2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Your health information matters
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
              Keep your profile accurate and up to date. Only share sensitive
              medical information with services and people you trust.
            </p>
          </div>
        </div>
      </div>

      {/* Edit modals */}
      {activeModal === 'demographics' && (
        <EditDemographicsModal
          profile={profile.profile}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdate}
        />
      )}

      {activeModal === 'conditions' && (
        <EditConditionsModal
          title="Edit Conditions"
          items={healthProfile.conditions || []}
          field="conditions"
          onClose={() => setActiveModal(null)}
          onSave={handleUpdate}
        />
      )}

      {activeModal === 'allergies' && (
        <EditConditionsModal
          title="Edit Allergies"
          items={healthProfile.allergies || []}
          field="allergies"
          onClose={() => setActiveModal(null)}
          onSave={handleUpdate}
        />
      )}

      {activeModal === 'medications' && (
        <EditConditionsModal
          title="Edit Medications"
          items={healthProfile.medications || []}
          field="medications"
          onClose={() => setActiveModal(null)}
          onSave={handleUpdate}
        />
      )}

      {activeModal === 'symptoms' && (
        <EditSymptomsModal
          symptoms={healthProfile.symptoms || []}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdate}
        />
      )}
    </main>
  );
};

// Reusable icon component
const SmallIcon = ({ name }) => {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-4 w-4',
    'aria-hidden': true,
  };

  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    'user-round': (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M5 21v-1a7 7 0 0 1 14 0v1" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1Z" />
    ),
    'map-pin': (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
};

// Personal information row
const InfoRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 py-3.5 first:pt-1 last:pb-1">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
      <SmallIcon name={icon} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold leading-5 text-slate-800">
        {value}
      </p>
    </div>
  </div>
);

// Medical tags
const ArrayDisplay = ({
  items,
  emptyMessage,
  description,
  theme = 'blue',
}) => {
  const themes = {
    blue: {
      icon: 'text-blue-600 bg-blue-50',
      badge: 'border-blue-100 bg-blue-50 text-blue-700',
      empty: 'border-blue-100 bg-blue-50/60',
    },
    orange: {
      icon: 'text-orange-600 bg-orange-50',
      badge: 'border-orange-100 bg-orange-50 text-orange-700',
      empty: 'border-orange-100 bg-orange-50/60',
    },
    purple: {
      icon: 'text-purple-600 bg-purple-50',
      badge: 'border-purple-100 bg-purple-50 text-purple-700',
      empty: 'border-purple-100 bg-purple-50/60',
    },
  };

  const style = themes[theme] || themes.blue;

  if (!items || items.length === 0) {
    return (
      <div>
        <p className="mb-4 text-xs leading-5 text-slate-500">
          {description}
        </p>
        <div className={`rounded-2xl border border-dashed p-5 ${style.empty}`}>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-slate-600">
            {emptyMessage}
          </p>
          <p className="mt-1 text-center text-xs text-slate-400">
            Use Edit to add information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs leading-5 text-slate-500">{description}</p>
        <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-bold ${style.icon}`}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {items.map((item, index) => {
          const label =
            typeof item === 'string'
              ? item
              : item?.name || item?.description || item?.condition || 'Item';

          return (
            <span
              key={`${label}-${index}`}
              className={`inline-flex max-w-full items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 ${style.badge}`}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" />
              <span className="break-words">{label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

// Symptoms timeline
const SymptomsDisplay = ({ symptoms }) => {
  if (!symptoms || symptoms.length === 0) {
    return (
      <EmptyMedicalState
        title="No symptoms recorded"
        description="Symptoms you add will appear here, helping you keep track of what you've experienced."
        theme="orange"
      />
    );
  }

  return (
    <div className="space-y-4">
      {symptoms.map((symptom, index) => (
        <article
          key={symptom._id || `${symptom.description}-${index}`}
          className="group relative overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 transition-all duration-200 hover:border-orange-200 hover:shadow-md sm:p-5"
        >
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-orange-400 to-amber-300" />

          <div className="flex items-start gap-3 pl-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-lg">
              🤒
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                {symptom.description || 'Symptom'}
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {symptom.date && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                    <SmallIcon name="calendar" />
                    {new Date(symptom.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}

                {symptom.severity && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1.5 text-xs font-semibold text-orange-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    Severity: {symptom.severity}
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

// Medical history timeline
const HistoryDisplay = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <EmptyMedicalState
        title="No medical history recorded"
        description="Your recorded diagnoses and relevant medical history will appear here."
        theme="purple"
      />
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item, index) => (
        <article
          key={item._id || `${item.condition}-${index}`}
          className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-white p-4 transition-all duration-200 hover:border-purple-200 hover:shadow-md sm:p-5"
        >
          <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-purple-500 to-violet-300" />

          <div className="flex items-start gap-3 pl-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-lg">
              📋
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="break-words text-sm font-bold text-slate-800 sm:text-base">
                {item.condition || 'Medical history entry'}
              </h3>

              {item.diagnosisDate && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <SmallIcon name="calendar" />
                  Diagnosed{' '}
                  {new Date(item.diagnosisDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}

              {item.notes && (
                <p className="mt-3 rounded-xl bg-purple-50/70 p-3 text-sm leading-6 text-slate-600">
                  {item.notes}
                </p>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

// Reusable empty state
const EmptyMedicalState = ({ title, description, theme = 'blue' }) => {
  const themes = {
    blue: 'border-blue-100 bg-blue-50/60 text-blue-600',
    orange: 'border-orange-100 bg-orange-50/60 text-orange-600',
    purple: 'border-purple-100 bg-purple-50/60 text-purple-600',
  };

  return (
    <div className={`rounded-2xl border border-dashed p-6 text-center ${themes[theme] || themes.blue}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M12 5v14M5 12h14"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-700">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
};

export default Profile;