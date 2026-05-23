export type VerificationStatus = 'unverified' | 'email' | 'id';

export interface ConnectProfile {
  id: string;
  name: string;
  email: string;
  age: number;
  gender?: string;
  bio: string;
  profilePhoto?: string;
  idCardScan?: string;
  facePhoto?: string;
  emailVerified: boolean;
  travelGroupCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  languages: string[];
  interests: string[];
  verified: VerificationStatus;
  isHost: boolean;
  isLookingForBuddy: boolean;
  hostDetails?: {
    location: string;
    spaceType: string;
    maxGuests: number;
    houseRules: string;
  };
  buddyDetails?: {
    destinations: string[];
    startDate: string;
    endDate: string;
    companionAge: string;
    companionGender: string;
    activities: string[];
    travelStyle: string;
  };
  createdAt: string;
  profileVisibility: 'public' | 'private';
}
