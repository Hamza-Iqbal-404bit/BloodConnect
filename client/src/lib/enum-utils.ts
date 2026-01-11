import { BloodGroup, UrgencyLevel, RequestStatus, ApprovalStatus } from '@/types';

// Blood group display mapping (enum value -> display string)
export const bloodGroupDisplay: Record<BloodGroup, string> = {
    [BloodGroup.A_POS]: 'A+',
    [BloodGroup.A_NEG]: 'A-',
    [BloodGroup.B_POS]: 'B+',
    [BloodGroup.B_NEG]: 'B-',
    [BloodGroup.AB_POS]: 'AB+',
    [BloodGroup.AB_NEG]: 'AB-',
    [BloodGroup.O_POS]: 'O+',
    [BloodGroup.O_NEG]: 'O-',
};

// Reverse lookup: display string -> enum value
export const bloodGroupFromDisplay: Record<string, BloodGroup> = {
    'A+': BloodGroup.A_POS,
    'A-': BloodGroup.A_NEG,
    'B+': BloodGroup.B_POS,
    'B-': BloodGroup.B_NEG,
    'AB+': BloodGroup.AB_POS,
    'AB-': BloodGroup.AB_NEG,
    'O+': BloodGroup.O_POS,
    'O-': BloodGroup.O_NEG,
};

// All blood groups in order for dropdowns
export const BLOOD_GROUPS = Object.values(BloodGroup);
export const BLOOD_GROUP_OPTIONS = BLOOD_GROUPS.map((value) => ({
    value,
    label: bloodGroupDisplay[value],
}));

// Urgency level display mapping
export const urgencyDisplay: Record<UrgencyLevel, string> = {
    [UrgencyLevel.LOW]: 'Normal',
    [UrgencyLevel.MEDIUM]: 'Urgent',
    [UrgencyLevel.HIGH]: 'High',
    [UrgencyLevel.CRITICAL]: 'Emergency',
};

export const URGENCY_LEVELS = Object.values(UrgencyLevel);
export const URGENCY_OPTIONS = URGENCY_LEVELS.map((value) => ({
    value,
    label: urgencyDisplay[value],
}));

// Request status display mapping
export const requestStatusDisplay: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'Pending',
    [RequestStatus.APPROVED]: 'Approved',
    [RequestStatus.ASSIGNED]: 'Assigned',
    [RequestStatus.REJECTED]: 'Rejected',
    [RequestStatus.FULFILLED]: 'Fulfilled',
};

// Approval status display mapping
export const approvalStatusDisplay: Record<ApprovalStatus, string> = {
    [ApprovalStatus.PENDING]: 'Pending',
    [ApprovalStatus.APPROVED]: 'Approved',
    [ApprovalStatus.REJECTED]: 'Rejected',
};

// Color mappings for badges
export const bloodGroupColors: Record<BloodGroup, string> = {
    [BloodGroup.A_POS]: 'bg-red-100 text-red-800 border-red-200',
    [BloodGroup.A_NEG]: 'bg-red-100 text-red-800 border-red-200',
    [BloodGroup.B_POS]: 'bg-blue-100 text-blue-800 border-blue-200',
    [BloodGroup.B_NEG]: 'bg-blue-100 text-blue-800 border-blue-200',
    [BloodGroup.AB_POS]: 'bg-purple-100 text-purple-800 border-purple-200',
    [BloodGroup.AB_NEG]: 'bg-purple-100 text-purple-800 border-purple-200',
    [BloodGroup.O_POS]: 'bg-green-100 text-green-800 border-green-200',
    [BloodGroup.O_NEG]: 'bg-green-100 text-green-800 border-green-200',
};

export const urgencyColors: Record<UrgencyLevel, string> = {
    [UrgencyLevel.LOW]: 'bg-gray-100 text-gray-700',
    [UrgencyLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800',
    [UrgencyLevel.HIGH]: 'bg-orange-100 text-orange-800',
    [UrgencyLevel.CRITICAL]: 'bg-red-100 text-red-800 animate-pulse',
};

export const approvalStatusColors: Record<ApprovalStatus, string> = {
    [ApprovalStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [ApprovalStatus.APPROVED]: 'bg-green-100 text-green-800',
    [ApprovalStatus.REJECTED]: 'bg-red-100 text-red-800',
};

export const requestStatusColors: Record<RequestStatus, string> = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequestStatus.APPROVED]: 'bg-blue-100 text-blue-800',
    [RequestStatus.ASSIGNED]: 'bg-purple-100 text-purple-800',
    [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
    [RequestStatus.FULFILLED]: 'bg-green-100 text-green-800',
};

// Helper function to get display string for any blood group
export function getBloodGroupDisplay(bloodGroup: BloodGroup | string): string {
    if (Object.values(BloodGroup).includes(bloodGroup as BloodGroup)) {
        return bloodGroupDisplay[bloodGroup as BloodGroup];
    }
    // If it's already a display string, return as-is
    return bloodGroup;
}

// Helper function to get display string for urgency level
export function getUrgencyDisplay(urgency: UrgencyLevel | string): string {
    if (Object.values(UrgencyLevel).includes(urgency as UrgencyLevel)) {
        return urgencyDisplay[urgency as UrgencyLevel];
    }
    return urgency;
}
