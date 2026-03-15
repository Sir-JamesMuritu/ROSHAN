export interface ProfileData {
  first_name?: string | null;
  last_name?: string | null;
  gender?: string | null;
  phone?: string | null;
  current_location?: string | null;
  avatar_url?: string | null;
  guardian_name?: string | null;
  guardian_relation?: string | null;
  guardian_mobile?: string | null;
}

const PROFILE_FIELDS: (keyof ProfileData)[] = [
  "first_name",
  "last_name",
  "gender",
  "phone",
  "current_location",
  "avatar_url",
  "guardian_name",
  "guardian_relation",
  "guardian_mobile",
];

export function getProfileCompletion(profile: ProfileData | null | undefined): number {
  if (!profile) return 0;
  const filled = PROFILE_FIELDS.filter((f) => {
    const val = profile[f];
    return val !== null && val !== undefined && val.trim() !== "";
  });
  return Math.round((filled.length / PROFILE_FIELDS.length) * 100);
}

export function getMissingFields(profile: ProfileData | null | undefined): string[] {
  if (!profile) return PROFILE_FIELDS.map(fieldLabel);
  return PROFILE_FIELDS.filter((f) => {
    const val = profile[f];
    return !val || val.trim() === "";
  }).map(fieldLabel);
}

function fieldLabel(key: string): string {
  const labels: Record<string, string> = {
    first_name: "First Name",
    last_name: "Last Name",
    gender: "Gender",
    phone: "Student Mobile No",
    current_location: "Current Location",
    avatar_url: "Passport Photo",
    guardian_name: "Guardian Name",
    guardian_relation: "Guardian Relation",
    guardian_mobile: "Guardian Mobile No",
  };
  return labels[key] || key;
}
