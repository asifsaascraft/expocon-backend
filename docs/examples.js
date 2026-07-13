// Authentication Examples

export const registerAdminExample = {
  fullName: "Super Admin",
  email: "admin@example.com",
  mobile: "9876543210",
  password: "Admin@123",
};

export const registerUserExample = {
  fullName: "John Doe",
  email: "john@example.com",
  mobile: "9876543211",
  password: "User@123",
};

export const registerPartnerExample = {
  fullName: "ABC Technologies",
  email: "partner@example.com",
  mobile: "9876543212",
  password: "Partner@123",
};

export const loginExample = {
  email: "admin@example.com",
  password: "Admin@123",
};

export const forgotPasswordExample = {
  email: "admin@example.com",
};

export const resetPasswordExample = {
  password: "NewPassword@123",
};

export const resendVerificationEmailExample = {
  email: "admin@example.com",
};

// User Examples

export const updateProfileExample = {
  fullName: "John Doe Updated",
  mobile: "9876543213",
  language: "en",
  timezone: "Asia/Kolkata",
};

// Staff Examples

export const createStaffExample = {
  fullName: "Rahul Sharma",
  username: "rahulstaff",
  email: "rahul@example.com",
  mobile: "9876543214",
  permissions: ["event.create", "event.update", "user.view"],
};

// Partner Examples

export const approvePartnerExample = {
  remarks: "Approved by admin",
};

export const rejectPartnerExample = {
  remarks: "Required documents are missing.",
};

// Password Examples

export const changePasswordExample = {
  currentPassword: "OldPassword@123",
  newPassword: "NewPassword@123",
};

// Response Examples

export const loginSuccessExample = {
  success: true,
  message: "Login successful.",
  data: {
    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx.xxx",
    user: {
      _id: "6852b4d04ef5f2e4dbd0d001",
      fullName: "Super Admin",
      email: "admin@example.com",
      role: "admin",
      status: "active",
      isEmailVerified: true,
    },
  },
};

export const successExample = {
  success: true,
  message: "Operation completed successfully.",
};

export const errorExample = {
  success: false,
  message: "Something went wrong.",
};

export const uploadProfileImageExample = {
  profileImage: "(binary)",
};

export const profileResponseExample = {
  success: true,
  message: "Profile fetched successfully.",
  data: {
    _id: "6852b4d04ef5f2e4dbd0d001",

    fullName: "John Doe",

    username: "johndoe",

    email: "john@example.com",

    mobile: "9876543210",

    profileImage:
      "https://your-bucket.s3.ap-south-1.amazonaws.com/profile-images/profile.jpg",

    role: "user",

    status: "active",

    isEmailVerified: true,

    language: "en",

    timezone: "Asia/Kolkata",

    createdAt: "2026-07-09T10:30:00.000Z",

    updatedAt: "2026-07-09T10:30:00.000Z",
  },
};

export const uploadProfileImageSuccessExample = {
  success: true,

  message: "Profile image uploaded successfully.",

  data: {
    _id: "6852b4d04ef5f2e4dbd0d001",

    fullName: "John Doe",

    username: "johndoe",

    email: "john@example.com",

    profileImage:
      "https://your-bucket.s3.ap-south-1.amazonaws.com/profile-images/profile.jpg",

    role: "user",
  },
};

export const deleteProfileImageSuccessExample = {
  success: true,

  message: "Profile image deleted successfully.",

  data: {
    _id: "6852b4d04ef5f2e4dbd0d001",

    fullName: "John Doe",

    username: "johndoe",

    email: "john@example.com",

    profileImage: null,

    role: "user",
  },
};

// Company Type Examples
export const createCompanyTypeExample = {
  companyTypeName: "Professional Conference Organiser (PCO)",
};

export const updateCompanyTypeExample = {
  companyTypeName: "Medical Equipment Company",
};

// State Examples
export const createStateExample = {
  state: "Uttar Pradesh",
};

export const updateStateExample = {
  state: "Maharashtra",
};

// Association Type Examples
export const createAssociationTypeExample = {
  associationTypeName: "Medical Association",
};

export const updateAssociationTypeExample = {
  associationTypeName: "Healthcare Association",
};

// Event Type Examples
export const createEventTypeExample = {
  eventTypeName: "Conference",
};

export const updateEventTypeExample = {
  eventTypeName: "International Conference",
};

// Exhibition Type Examples
export const createExhibitionTypeExample = {
  exhibitionTypeName: "Trade Exhibition",
};

export const updateExhibitionTypeExample = {
  exhibitionTypeName: "International Trade Exhibition",
};

// Conference Type Examples
export const createConferenceTypeExample = {
  conferenceTypeName: "Medical Conference",
};

export const updateConferenceTypeExample = {
  conferenceTypeName: "International Medical Conference",
};

// Job Type Examples
export const createJobTypeExample = {
  jobTypeName: "Doctor",
};

export const updateJobTypeExample = {
  jobTypeName: "Senior Doctor",
};

// Conference Segment Examples
export const createConferenceSegmentExample = {
  conferenceSegmentName: "Cardiology",
};

export const updateConferenceSegmentExample = {
  conferenceSegmentName: "Interventional Cardiology",
};

// Interested As Examples
export const createInterestedAsExample = {
  interestedAsName: "Delegate",
};

export const updateInterestedAsExample = {
  interestedAsName: "Speaker",
};

// Advertisement Location Examples
export const createAdvertisementLocationExample = {
  advertisementLocationName: "Homepage Banner",
};

export const updateAdvertisementLocationExample = {
  advertisementLocationName: "Homepage Top Banner",
};