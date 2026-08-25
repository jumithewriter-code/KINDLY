'use client'

import { useCallback, useEffect, useState } from 'react'

export type Profile = {
  /** The child's name, collected during onboarding. */
  name: string
  /** The caregiver's name, shown in the dashboard greeting and child "someone is coming" screen. */
  caregiverName: string
  /** Supports chosen during onboarding; rendered on the profile screen. */
  supports: string[]
  /**
   * Parent gate for leaving Child Mode. This is a speed bump to stop a child
   * tapping back into the caregiver dashboard — not a security boundary. It is
   * stored in plain text in localStorage and should never hold a real secret.
   */
  pin: string | null
}

/** Supports that describe how the child communicates, rather than sensory needs. */
export const COMMUNICATION_SUPPORTS = ['Words', 'Pictures', 'Gestures']

export const DEFAULT_PROFILE: Profile = {
  name: 'Alex',
  caregiverName: 'Jamie',
  supports: ['Quiet spaces', 'Visual choices', 'Extra processing time', 'Deep pressure', 'Words', 'Pictures'],
  pin: '1234',
}

const STORAGE_KEY = 'kindly.profile.v1'

export function initialOf(name: string) {
  return name.trim().charAt(0).toUpperCase() || DEFAULT_PROFILE.name.charAt(0)
}

/** Split supports into the two groups the profile screen renders. */
export function groupSupports(supports: string[]) {
  return {
    sensory: supports.filter((item) => !COMMUNICATION_SUPPORTS.includes(item)),
    communication: supports.filter((item) => COMMUNICATION_SUPPORTS.includes(item)),
  }
}

export function readProfile(): Profile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    const parsed = JSON.parse(raw) as Partial<Profile>
    return {
      name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : DEFAULT_PROFILE.name,
      caregiverName:
        typeof parsed.caregiverName === 'string' && parsed.caregiverName.trim()
          ? parsed.caregiverName.trim()
          : DEFAULT_PROFILE.caregiverName,
      supports: Array.isArray(parsed.supports) ? parsed.supports.filter((item): item is string => typeof item === 'string') : DEFAULT_PROFILE.supports,
      pin: typeof parsed.pin === 'string' && parsed.pin ? parsed.pin : null,
    }
  } catch {
    // Corrupt or unreadable storage should never take the app down.
    return DEFAULT_PROFILE
  }
}

export function writeProfile(profile: Profile) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  } catch {
    // Private-mode or quota failures are non-fatal; the session still works in memory.
  }
}

/**
 * Reads the saved profile after mount. The first render always returns the
 * defaults so the server and client markup match; `ready` tells callers when
 * the stored values have been applied.
 */
export function useProfile() {
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setProfileState(readProfile())
    setReady(true)
  }, [])

  const setProfile = useCallback((next: Profile) => {
    setProfileState(next)
    writeProfile(next)
  }, [])

  return { profile, setProfile, ready }
}
