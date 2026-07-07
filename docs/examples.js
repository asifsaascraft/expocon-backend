// Authentication Examples

export const registerAdminExample = {
  fullName: "Super Admin",
  username: "admin",
  email: "admin@example.com",
  mobile: "9876543210",
  password: "Admin@123",
};

export const registerUserExample = {
  fullName: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  mobile: "9876543211",
  password: "User@123",
};

export const registerPartnerExample = {
  fullName: "ABC Technologies",
  username: "abctech",
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
  username: "johnupdated",
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
  permissions: [
    "event.create",
    "event.update",
    "user.view",
  ],
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
    accessToken:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx.xxx",
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