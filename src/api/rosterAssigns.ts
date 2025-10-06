import { getOrganizationId, getEmployeeId,getDepartmentId,getAuthHeaders } from '../utils/authUtils';



// Personal Schedule Interfaces
export interface PersonalShift {
  id: string;
  date: string; 
  startTime: string; 
  endTime: string; 
  shiftType: {
    name: string;
    color: string; 
  };
  department: {
    name: string;
    location: string;
  };
  role: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

export interface PersonalShiftConverted {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  shiftType: {
    name: string;
    color: string; 
  };
  department: {
    name: string;
    location: string;
  };
  role: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}


const getShiftColor = (shiftName: string): string => {
  const name = shiftName.toLowerCase();

  if (name.includes("morning")) return "bg-yellow-100 text-yellow-800";
  if (name.includes("day")) return "bg-blue-100 text-blue-800";
  if (name.includes("evening")) return "bg-orange-100 text-orange-800";
  if (name.includes("night")) return "bg-purple-100 text-purple-800";

  return "bg-gray-100 text-gray-800"; // default
};

const convertPersonalShift = (shift: PersonalShift): PersonalShiftConverted => {
  return {
    ...shift,
    date: new Date(shift.date),
    startTime: new Date(shift.startTime),
    endTime: new Date(shift.endTime),
    shiftType: {
      ...shift.shiftType,
      color: getShiftColor(shift.shiftType.name),
    },
  };
};

export const personalScheduleAPI = {
  getShiftsByEmployee: async (): Promise<PersonalShiftConverted[]> => {

    const employeeId = getEmployeeId();
    const response = await fetch(
      `http://localhost:8080/api/rosterAssignments/employee/${employeeId}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const shifts: PersonalShift[] = await response.json();

    return shifts.map(convertPersonalShift);
  },
};
