// Service để đồng bộ dữ liệu giữa các dashboard
// Đây là giải pháp tạm thời, trong thực tế sẽ dùng API và database

export interface Appointment {
  id: number;
  patientName: string;
  email: string;
  phone: string;
  time: string;
  date: string;
  symptoms: string;
  status: string;
  assignedDoctor?: string;
  room?: string;
  visitId?: number;
  visitStatus?: string;
  queueNumber?: number;
  requestedDoctor?: string;
  services?: Array<{ name: string; price: number }>;
}

export interface Visit {
  id: number;
  visitId: number;
  queueNumber: number;
  patientName: string;
  time: string;
  symptoms: string;
  status: string;
  room: string;
  doctor: string;
  email: string;
  phone: string;
}

export interface Assignment {
  id: number;
  patientName: string;
  room: string;
  services: string[];
  status: string;
  result?: string;
  notes?: string;
}

class ClinicDataService {
  private static instance: ClinicDataService;
  private appointments: Appointment[] = [];
  private visits: Visit[] = [];
  private assignments: Assignment[] = [];
  private listeners: Array<() => void> = [];

  private constructor() {
    this.initializeMockData();
  }

  static getInstance(): ClinicDataService {
    if (!ClinicDataService.instance) {
      ClinicDataService.instance = new ClinicDataService();
    }
    return ClinicDataService.instance;
  }

  private initializeMockData() {
    // Khởi tạo dữ liệu mock ban đầu
    this.appointments = [
      {
        id: 1,
        patientName: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phone: "0901234567",
        time: "08:00",
        date: new Date().toISOString().split("T")[0],
        symptoms: "Đau đầu, chóng mặt",
        status: "waiting-for-confirmation",
        assignedDoctor: undefined,
        room: undefined,
        visitId: undefined,
        visitStatus: undefined,
        queueNumber: undefined,
        requestedDoctor: undefined,
      },
      {
        id: 2,
        patientName: "Trần Thị B",
        email: "tranthib@gmail.com",
        phone: "0912345678",
        time: "09:00",
        date: new Date().toISOString().split("T")[0],
        symptoms: "Mất ngủ",
        status: "waiting-for-check-in",
        assignedDoctor: undefined,
        room: undefined,
        visitId: undefined,
        visitStatus: undefined,
        queueNumber: undefined,
        requestedDoctor: undefined,
      },
      {
        id: 3,
        patientName: "Phạm Văn C",
        email: "phamvanc@gmail.com",
        phone: "0988888888",
        time: "10:00",
        date: new Date().toISOString().split("T")[0],
        symptoms: "Tê tay, đau vai gáy",
        status: "checked-in",
        assignedDoctor: "BS. Nguyễn Văn An",
        room: "Phòng 1",
        visitId: undefined,
        visitStatus: undefined,
        queueNumber: undefined,
        requestedDoctor: undefined,
      },
      {
        id: 4,
        patientName: "Lê Thị D",
        email: "lethid@gmail.com",
        phone: "0933333333",
        time: "11:00",
        date: new Date().toISOString().split("T")[0],
        symptoms: "Khó thở",
        status: "in-progress",
        assignedDoctor: "BS. Trần Thị Bình",
        room: "Phòng 2",
        visitId: 1703123456789,
        visitStatus: "in-examination",
        queueNumber: 1,
        requestedDoctor: undefined,
      },
      {
        id: 5,
        patientName: "Ngô Thị Y",
        email: "ngothiy@gmail.com",
        phone: "0977123456",
        time: "14:00",
        date: new Date().toISOString().split("T")[0],
        symptoms: "Cảm cúm, đau họng",
        status: "pending",
        assignedDoctor: "BS. Lê Quang Huy",
        room: "Phòng 3",
        visitId: 1703123456790,
        visitStatus: "pending",
        queueNumber: 2,
        requestedDoctor: undefined,
        services: [
          { name: "Chụp CT", price: 500000 },
          { name: "Điện não đồ", price: 400000 },
        ],
      },
    ];

    // Khởi tạo visits từ appointments có visitId
    this.visits = this.appointments
      .filter(apt => apt.visitId)
      .map(apt => ({
        id: apt.visitId!,
        visitId: apt.visitId!,
        queueNumber: apt.queueNumber!,
        patientName: apt.patientName,
        time: apt.time,
        symptoms: apt.symptoms,
        status: apt.visitStatus!,
        room: apt.room!,
        doctor: apt.assignedDoctor!,
        email: apt.email,
        phone: apt.phone,
      }));

    // Khởi tạo assignments từ appointments có services
    this.assignments = this.appointments
      .filter(apt => apt.services && apt.services.length > 0)
      .flatMap(apt => 
        apt.services!.map((service, index) => ({
          id: apt.visitId! * 100 + index,
          patientName: apt.patientName,
          room: apt.room!,
          services: [service.name],
          status: apt.status === "pending" ? "pending" : "waiting",
        }))
      );
  }

  // Subscribe để lắng nghe thay đổi
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify tất cả listeners
  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // Appointment methods
  getAppointments(): Appointment[] {
    return [...this.appointments];
  }

  updateAppointment(id: number, updates: Partial<Appointment>) {
    this.appointments = this.appointments.map(apt =>
      apt.id === id ? { ...apt, ...updates } : apt
    );
    this.notify();
  }

  // Visit methods
  getVisits(): Visit[] {
    return [...this.visits];
  }

  updateVisit(visitId: number, updates: Partial<Visit>) {
    this.visits = this.visits.map(visit =>
      visit.visitId === visitId ? { ...visit, ...updates } : visit
    );
    
    // Đồng bộ với appointments
    this.appointments = this.appointments.map(apt =>
      apt.visitId === visitId ? { ...apt, visitStatus: updates.status } : apt
    );
    
    this.notify();
  }

  createVisit(appointment: Appointment, doctor: string, room: string) {
    const visitId = Date.now();
    const queueNumber = Math.floor(Math.random() * 100) + 1;
    
    const newVisit: Visit = {
      id: visitId,
      visitId,
      queueNumber,
      patientName: appointment.patientName,
      time: appointment.time,
      symptoms: appointment.symptoms,
      status: "waiting",
      room,
      doctor,
      email: appointment.email,
      phone: appointment.phone,
    };

    this.visits.push(newVisit);
    
    // Cập nhật appointment
    this.updateAppointment(appointment.id, {
      status: "in-progress",
      assignedDoctor: doctor,
      room,
      visitId,
      visitStatus: "waiting",
      queueNumber,
    });

    this.notify();
    return newVisit;
  }

  // Assignment methods
  getAssignments(): Assignment[] {
    return [...this.assignments];
  }

  updateAssignment(id: number, updates: Partial<Assignment>) {
    this.assignments = this.assignments.map(assignment =>
      assignment.id === id ? { ...assignment, ...updates } : assignment
    );
    this.notify();
  }

  createAssignments(appointment: Appointment, labTests: Array<{ room: string; services: string[] }>) {
    const newAssignments = labTests.map((test, index) => ({
      id: appointment.visitId! * 100 + index,
      patientName: appointment.patientName,
      room: test.room,
      services: test.services,
      status: "pending",
    }));

    this.assignments.push(...newAssignments);
    this.notify();
    return newAssignments;
  }

  // Utility methods
  getAppointmentByPatientName(patientName: string): Appointment | undefined {
    return this.appointments.find(apt => apt.patientName === patientName);
  }

  getVisitByPatientName(patientName: string): Visit | undefined {
    return this.visits.find(visit => visit.patientName === patientName);
  }

  getAssignmentsByPatientName(patientName: string): Assignment[] {
    return this.assignments.filter(assignment => assignment.patientName === patientName);
  }

  // Reset data (for testing)
  resetData() {
    this.initializeMockData();
    this.notify();
  }
}

export default ClinicDataService; 