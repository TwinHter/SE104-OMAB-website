// src/types/index.ts

// ====== ENUMS ======
// Các Enums này khớp với Backend.Core.Enums
export enum UserRole {
    Admin = 0,
    Doctor = 1,
    Patient = 2,
}

export enum AppointmentStatus {
    PendingConfirmation = "pendingconfirmation",
    Scheduled = "scheduled",
    Completed = "completed",
    Cancelled = "cancelled",
    Rejected = "rejected",
    // Các trạng thái khác nếu có
}

export enum AppointmentOutcomeStatus {
    CompletedWithNotes = "completedwithnotes",
    PatientAbsent = "patientabsent",
    Incomplete = "incomplete",
}

// Gender trong backend là string, giữ nguyên string cho tiện
export enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other",
}

// ====== CORE INTERFACES ======
// BaseEntity: Khớp với các Id là string trong DTOs
export interface BaseEntity {
    id: string;
}

// User: Cập nhật để khớp với UserDto trả về từ AuthController
export interface User extends BaseEntity {
    name: string;
    email: string;
    type: UserRole; // Backend trả về int, frontend sử dụng enum
    avatarUrl?: string;
    phone?: string;
    address?: string;
    gender?: Gender; // string ở backend, enum ở frontend (có thể map)
    dateOfBirth?: string; // YYYY-MM-DD
    description?: string;
    bloodType?: string; // Patient specific
    allergies?: string; // Patient specific
    insuranceNumber?: string; // Patient specific
    specialty?: string; // Doctor specific
    experienceYears?: number; // Doctor specific
    // Relatives không có trong UserDto, nên không đưa vào đây
}

// Doctor: Cập nhật để khớp với DoctorProfileDto
export interface Doctor extends BaseEntity {
    // Thuộc tính từ DoctorProfileDto
    name: string; // Từ User
    email: string; // Từ User
    specialty: string;
    avatarUrl: string; // Không optional trong DoctorProfileDto
    consultationFee: number;
    experienceYears: number;
    location: string;
    availability: { [date: string]: string[] };
    reviews?: DoctorReview[]; // DoctorReviewDto
    phone?: string; // Từ User
    gender?: Gender; // Từ User
    dateOfBirth?: string; // Từ User
    description?: string; // Từ User
    avg_Rating?: number;
    total_Appointments?: number;
}

// Patient: Giữ nguyên, dựa trên User, thêm relatives nếu có thể fetch cùng patient
export interface Patient extends User {
    // Các trường bloodType, allergies, insuranceNumber đã có trong User
    relatives?: Relative[]; // Chỉ khi relatives được fetch trực tiếp với Patient profile
}

// Relative: Khớp với RelativeDto
export interface Relative extends BaseEntity {
    name: string;
    relationship: string;
    phone?: string;
    // userId không có trong RelativeDto trả về, nhưng có thể là internal của backend
    // Nếu bạn cần gửi userId khi tạo/cập nhật relative, bạn sẽ thêm vào DTO request
}

// Specialty: Giữ nguyên (Không có DTO cho Specialty được cung cấp, giả định vẫn vậy)
export interface Specialty extends BaseEntity {
    name: string;
    description?: string;
}

export interface DoctorReview extends BaseEntity {
    patientName: string;
    rating: number;
    comment: string;
    date: string; // ISO-MM-DDTHH:MM:SSZ
}

// Medication: Khớp với MedicationDto
export interface Medication extends BaseEntity {
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    // appointmentId không có trong MedicationDto, nên không đưa vào đây.
    // Nếu cần cho request tạo Medication riêng thì thêm vào DTO request đó.
}

// Appointment: Khớp với AppointmentDto
export interface Appointment extends BaseEntity {
    date: string; // ISO-MM-DDTHH:MM:SSZ
    doctor: AppointmentDoctorInfo; // AppointmentDoctorInfoDto
    patientId: string;
    patientName: string;
    symptoms?: string; // Optional
    notes?: string; // Optional
    prescription?: Medication[]; // Collection<MedicationDto>
    status: AppointmentStatus; // Enum string representation (e.g., "scheduled", "completed")
    cost: number;
    patientReview?: PatientReviewInput; // PatientReviewInputDto
    outcomeStatus?: AppointmentOutcomeStatus; // Enum string representation (e.g., "completedwithnotes")
}

// Notification: Khớp với UserNotificationDto
export interface Notification extends BaseEntity {
    userId: string;
    context: string;
    dateTime: string; // ISO string
    isRead: boolean;
    type?: string;
    relatedLink?: string;
}

// ====== REQUEST & RESPONSE DATA TYPES ======

// LoginRequestDto -> LoginData
export interface LoginData {
    email: string;
    password: string;
    role: UserRole;
}

// RegisterRequestDto -> RegisterData
export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

// UpdateUserDto -> UpdateUserData
export interface UpdateUserData {
    name?: string;
    email?: string; // DTO có Email
    avatarUrl?: string;
    phone?: string;
    address?: string;
    gender?: Gender;
    dateOfBirth?: string;
    description?: string;
    bloodType?: string;
    allergies?: string;
    insuranceNumber?: string;
    specialty?: string; // Chỉ dành cho Doctor
    experienceYears?: number; // Chỉ dành cho Doctor
    consultationFee?: number; // Chỉ dành cho Doctor
    // UpdateUserDto không chứa các trường riêng của Doctor như specialty, experienceYears.
    // Nếu bạn muốn cập nhật các trường đó qua API /users/{id}, bạn cần backend UpdateUserDto có thêm các trường đó.
}

// CreateUserNotificationDto -> CreateNotificationData
export interface CreateNotificationData {
    context: string;
    type?: string;
    relatedLink?: string;
}

// AppointmentDoctorInfoDto -> AppointmentDoctorInfo
export interface AppointmentDoctorInfo {
    id: string;
    name: string;
    specialty: string;
    avatarUrl?: string;
}

// CreateAppointmentRequestDto -> CreateAppointmentData
export interface CreateAppointmentData {
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    doctor: AppointmentDoctorInfo; // Frontend sẽ gửi AppointmentDoctorInfo, chỉ cần ID bên trong
    patientId: string;
    patientName: string;
    symptoms?: string;
    cost: number;
}

// UpdateAppointmentStatusDto -> UpdateAppointmentStatusData
export interface UpdateAppointmentStatusData {
    status: AppointmentStatus; // Enum value
}

// UpdateAppointmentOutcomeDto -> RecordAppointmentOutcomeData
export interface RecordAppointmentOutcomeData {
    outcomeStatus: AppointmentOutcomeStatus; // Không optional trong DTO
    notes?: string;
    prescription?: {
        // Khớp với MedicationDto
        name: string;
        dosage?: string;
        frequency?: string;
        duration?: string;
    }[];
}

// PatientReviewInputDto -> PatientReviewInput
export interface PatientReviewInput {
    rating: number;
    comment: string;
}

// CreateDoctorReviewDto -> AddDoctorReviewData
export interface AddDoctorReviewData {
    patientName: string;
    rating: number;
    comment: string;
}

// UpdateDoctorAvailabilityDto -> DoctorAvailabilityUpdateData
export type AvailabilityStatus = "available" | "busy"; // String literals
export interface DoctorAvailabilityUpdateData {
    date: string;
    timeSlots: string[];
    status: AvailabilityStatus;
}

// Relative DTOs
export interface CreateRelativeData {
    // Từ CreateRelativeDto
    name: string;
    relationship: string;
    phone?: string;
}

export interface UpdateRelativeData extends BaseEntity {
    // Từ UpdateRelativeDto
    name: string;
    relationship: string;
    phone?: string;
}

export type DeleteRelativeData = BaseEntity;

export interface RelativeListResponse {
    // Từ RelativeListDto
    relatives: Relative[]; // List of RelativeDto
}

export interface CreateDoctorData {
    name: string;
    email: string;
    password: string; // Temporary password for the new doctor
    specialty: string;
    consultationFee: number;
    experienceYears: number;
    address: string;
    phone?: string;
    gender?: Gender;
    dateOfBirth?: string;
    description?: string;
    avatarUrl?: string;
}
export interface SystemOverviewStatistics {
    total_Doctors: number;
    total_Patients: number;
    total_Appointments: number; // Vẫn phải giả lập nếu không có API riêng
    total_Reviews: number; // Vẫn phải giả lập nếu không có API riêng
}

// ===========================================
// Thống kê cụ thể cho Bác sĩ (Dữ liệu này đã có sẵn từ API Doctor)
// ===========================================
export interface DoctorStatisticsOverview {
    avg_Rating: number;
    total_Appointments: number;
    total_Reviews: number; // Cần tính từ `reviews.length`
}

export interface ChangePasswordData {
    userId: string; // ID của người dùng cần đổi mật khẩu
    currentPassword: string; // Mật khẩu hiện tại
    newPassword: string; // Mật khẩu mới
    confirmNewPassword: string; // Xác nhận mật khẩu mới
}
