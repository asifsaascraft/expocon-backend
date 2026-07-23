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

// Admin User Examples
export const getAllUsersResponseExample = {
  success: true,
  message: "Users fetched successfully.",
  data: [
    {
      _id: "686f9c5c7a4d8b0012345678",
      fullName: "John Doe",
      username: "johndoe8x2k",
      email: "john@example.com",
      mobile: "9876543210",
      role: "user",
      status: "active",
      isEmailVerified: true,
      createdAt: "2026-07-15T10:30:00.000Z",
      updatedAt: "2026-07-15T10:30:00.000Z",
    },
  ],
  pagination: {
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

export const getAllStaffsResponseExample = {
  success: true,
  message: "Staffs fetched successfully.",
  data: [
    {
      _id: "686f9c5c7a4d8b0012345679",
      fullName: "Rahul Sharma",
      username: "rahulsharma9jk3",
      email: "rahul@example.com",
      mobile: "9876543211",
      role: "staff",
      status: "active",
      isEmailVerified: true,
      createdAt: "2026-07-15T10:30:00.000Z",
      updatedAt: "2026-07-15T10:30:00.000Z",
    },
  ],
  pagination: {
    total: 1,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
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

// Entry Type Examples
export const createEntryTypeExample = {
  entryTypeName: "Visitor",
};

export const updateEntryTypeExample = {
  entryTypeName: "VIP Visitor",
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

// Company Examples
export const createCompanyExample = {
  companyName: "OpenAI Technologies",
  companyEmail: "info@openai.com",
  companyTypeId: "687c9d2ef7b79a3d12345678",
  stateId: "687c9d2ef7b79a3d87654321",
  city: "Hyderabad",
  address: "Madhapur, Hyderabad",
  website: "https://openai.com",
  featured: false,
  mapLink: "https://maps.google.com/...",
  phone: "04012345678",
  mobile: "9876543210",
};

export const updateCompanyExample = {
  companyName: "OpenAI India Pvt Ltd",
  companyEmail: "india@openai.com",
  companyTypeId: "687c9d2ef7b79a3d12345678",
  stateId: "687c9d2ef7b79a3d87654321",
  city: "Bengaluru",
  address: "Whitefield, Bengaluru",
  website: "https://openai.com",
  featured: true,
  mapLink: "https://maps.google.com/...",
  phone: "08012345678",
  mobile: "9876543211",
};

export const uploadCompanyLogoExample = {
  uploadLogo: "(binary)",
};

export const rejectCompanyExample = {
  rejectionReason: "Company registration certificate is missing.",
};

export const companyResponseExample = {
  success: true,
  message: "Company fetched successfully.",
  data: {
    _id: "687c9d2ef7b79a3d12345678",
    companyName: "OpenAI Technologies",
    companyEmail: "info@openai.com",
    city: "Hyderabad",
    website: "https://openai.com",
    featured: false,
    status: "approved",
    uploadLogo:
      "https://your-bucket.s3.ap-south-1.amazonaws.com/company-logos/logo.png",
    createdAt: "2026-07-20T10:30:00.000Z",
    updatedAt: "2026-07-20T10:30:00.000Z",
  },
};

// Venue Examples
export const createVenueExample = {
  venueName: "Hyderabad International Convention Centre",
  stateId: "687c9d2ef7b79a3d87654321",
  city: "Hyderabad",
  address: "HITEC City, Hyderabad",
  website: "https://www.hicc.com",
  mapLink: "https://maps.google.com/...",
  featured: true,
  phone: "04012345678",
};

export const updateVenueExample = {
  venueName: "HICC Convention Centre",
  stateId: "687c9d2ef7b79a3d87654321",
  city: "Hyderabad",
  address: "HITEC City, Hyderabad",
  website: "https://www.hicc.com",
  mapLink: "https://maps.google.com/...",
  featured: false,
  phone: "04087654321",
};

export const rejectVenueExample = {
  rejectionReason: "Venue fire safety certificate is missing.",
};

// Exhibition Examples
export const createExhibitionExample = {
  eventTypeId: "687c9d2ef7b79a3d12345678",
  eventName: "India Pharma Expo 2026",
  eventShortName: "IPE2026",
  startDate: "2026-08-10",
  endDate: "2026-08-12",
  month: "August",
  year: "2026",
  entryTypeId: "687c9d2ef7b79a3d66666666",
  city: "Hyderabad",
  stateId: "687c9d2ef7b79a3d87654321",
  venueId: "687c9d2ef7b79a3d11111111",
  website: "https://www.indiapharmaexpo.com",
  companyId: "687c9d2ef7b79a3d22222222",
  exhibitionTypeId: "687c9d2ef7b79a3d33333333",
  frequency: "Annual",
  aboutExhibition:
    "India Pharma Expo is one of the largest pharmaceutical exhibitions in India.",
  exhibitorProfile:
    "Pharmaceutical Manufacturers, Medical Equipment Suppliers, API Manufacturers",
  speciality: "Pharmaceutical Machinery, Medical Devices, Healthcare Solutions",
  visitorProfile:
    "Doctors, Hospital Administrators, Distributors, Pharma Professionals",
};

export const updateExhibitionExample = {
  eventTypeId: "687c9d2ef7b79a3d12345678",
  eventName: "India Pharma Expo 2026 Updated",
  eventShortName: "IPE2026",
  startDate: "2026-08-11",
  endDate: "2026-08-13",
  month: "August",
  year: "2026",
  entryTypeId: "687c9d2ef7b79a3d66666666",
  city: "Bengaluru",
  stateId: "687c9d2ef7b79a3d87654321",
  venueId: "687c9d2ef7b79a3d11111111",
  website: "https://www.indiapharmaexpo.com",
  companyId: "687c9d2ef7b79a3d22222222",
  exhibitionTypeId: "687c9d2ef7b79a3d33333333",
  frequency: "Bi-Annual",
  aboutExhibition:
    "Updated information about India's leading pharmaceutical exhibition.",
  exhibitorProfile: "Manufacturers, Importers, Exporters, Healthcare Companies",
  speciality:
    "Medical Equipment, Pharmaceutical Machinery, Laboratory Technology",
  visitorProfile: "Doctors, Hospitals, Researchers, Pharma Companies",
};

export const uploadEventLogoExample = {
  uploadEventLogo: "(binary)",
};

export const rejectExhibitionExample = {
  rejectionReason:
    "Required event information and supporting documents are incomplete.",
};

export const exhibitionResponseExample = {
  success: true,
  message: "Exhibition fetched successfully.",
  data: {
    _id: "687c9d2ef7b79a3d44444444",

    eventTypeId: {
      _id: "687c9d2ef7b79a3d12345678",
      eventTypeName: "Exhibition",
    },

    eventName: "India Pharma Expo 2026",

    eventShortName: "IPE2026",

    startDate: "2026-08-10T00:00:00.000Z",

    endDate: "2026-08-12T00:00:00.000Z",

    month: "August",

    year: "2026",

    entryTypeId: {
      _id: "687c9d2ef7b79a3d66666666",
      entryTypeName: "Free Entry",
    },

    city: "Hyderabad",

    stateId: {
      _id: "687c9d2ef7b79a3d87654321",
      state: "Telangana",
    },

    venueId: {
      _id: "687c9d2ef7b79a3d11111111",
      venueName: "Hyderabad International Convention Centre",
    },

    website: "https://www.indiapharmaexpo.com",

    companyId: {
      _id: "687c9d2ef7b79a3d22222222",
      companyName: "ABC Events Pvt Ltd",
    },

    exhibitionTypeId: {
      _id: "687c9d2ef7b79a3d33333333",
      exhibitionTypeName: "Trade Exhibition",
    },

    uploadEventLogo:
      "https://your-bucket.s3.ap-south-1.amazonaws.com/event-logos/logo.png",

    frequency: "Annual",

    aboutExhibition:
      "India Pharma Expo is one of the largest pharmaceutical exhibitions in India.",

    exhibitorProfile:
      "Pharmaceutical Manufacturers, Medical Equipment Suppliers",

    speciality: "Medical Devices, Pharmaceutical Machinery",

    visitorProfile: "Doctors, Hospitals, Pharma Professionals",

    status: "approved",

    rejectionReason:
      "Required event information and supporting documents are incomplete.",

    createdAt: "2026-07-20T10:30:00.000Z",

    updatedAt: "2026-07-20T10:30:00.000Z",
  },
};

//==============================
// Association Examples
//==============================
export const createAssociationExample = {
  associationName: "Indian Medical Association",
  stateId: "687c9d2ef7b79a3d87654321",
  city: "Hyderabad",
  address: "HITEC City, Hyderabad",
  website: "https://imaindia.org",
  associationTypeId: "687c9d2ef7b79a3d99999999",
};

export const updateAssociationExample = {
  associationName: "Indian Medical Association Telangana",
  stateId: "687c9d2ef7b79a3d87654321",
  city: "Hyderabad",
  address: "Gachibowli, Hyderabad",
  website: "https://imaindia.org",
  associationTypeId: "687c9d2ef7b79a3d99999999",
};

export const rejectAssociationExample = {
  rejectionReason: "Association registration documents are incomplete.",
};

export const associationResponseExample = {
  success: true,
  message: "Association fetched successfully.",
  data: {
    _id: "68820d5b63ab9f0a12345678",

    associationName: "Indian Medical Association",

    stateId: {
      _id: "687c9d2ef7b79a3d87654321",
      state: "Telangana",
    },

    city: "Hyderabad",

    address: "HITEC City, Hyderabad",

    website: "https://imaindia.org",

    associationTypeId: {
      _id: "687c9d2ef7b79a3d99999999",
      associationTypeName: "Medical Association",
    },

    status: "approved",

    rejectionReason: "Association registration documents are incomplete.",

    createdBy: {
      _id: "687c9d2ef7b79a3d11111111",
      fullName: "Super Admin",
      email: "admin@example.com",
      role: "admin",
    },

    updatedBy: null,

    approvedBy: {
      _id: "687c9d2ef7b79a3d11111111",
      fullName: "Super Admin",
      email: "admin@example.com",
      role: "admin",
    },

    approvedAt: "2026-07-25T10:30:00.000Z",

    rejectedBy: null,

    rejectedAt: null,

    createdAt: "2026-07-25T10:30:00.000Z",

    updatedAt: "2026-07-25T10:30:00.000Z",
  },
};
