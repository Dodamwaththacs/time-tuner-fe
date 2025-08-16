// Remove the incorrect import - it creates circular dependency
import type { Shift } from "./../../src/pages/schedules/ScheduleBuilder";

export interface ShiftSkillRequirement {
  id: number;
  requiredCount: number;
  mandatory: boolean;
  shift: string;
  role: string;
  skill: string;
}

export interface CreateShift {
  id: string;
  shiftDate: string;
  requiredEmployees: number;
  priorityLevel: number;
  notes: string;
  createdAt: string;
  shiftType: string;
  department: string;
  requiredRole: string;
  organization: string;
  skillRequirements: ShiftSkillRequirement[];
}

export interface CreateShiftResponse {
  id?: string;
  shiftDate: string;
  requiredEmployees: number;
  priorityLevel: number;
  notes?: string;
  shiftType: string;
  department: string;
  requiredRole: string;
  organization: string;
  skillRequirements?: Omit<ShiftSkillRequirement, "id" | "shift">[];
}

const generateUniqueId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};

const organizationId = "123e4567-e89b-12d3-a456-426655440001";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

const createShiftRequest = (shift: Shift): CreateShiftResponse | null => {
  if (shift.status === "published") {
    return null;
  }

  const shiftDateTime = new Date(shift.shiftDate).toISOString();

  return {
    shiftDate: shiftDateTime,
    requiredEmployees: shift.requiredEmployees,
    priorityLevel: shift.priorityLevel,
    notes: shift.notes,
    shiftType: shift.shiftType,
    department: shift.department,
    requiredRole: shift.requiredRole,
    organization: organizationId,
    skillRequirements: shift.skillRequirements.map((req) => ({
      requiredCount: req.requiredCount,
      mandatory: req.mandatory,
      skill: req.skill,
      role: req.role,
    })),
  };
};

const mapToShift = (response: CreateShiftResponse): Shift => {
  return {
    id: response.id || generateUniqueId(),
    shiftDate: new Date(response.shiftDate).toISOString(),
    requiredEmployees: response.requiredEmployees,
    priorityLevel: response.priorityLevel,
    notes: response.notes || "",
    createdAt: new Date().toISOString(),
    shiftType: response.shiftType,
    department: response.department,
    requiredRole: response.requiredRole,
    skillRequirements:
      response.skillRequirements?.map((req) => ({
        id: generateUniqueId(),
        requiredCount: req.requiredCount,
        mandatory: req.mandatory,
        skill: req.skill,
        shift: "",
        role: req.role,
      })) || [],
    status: "published",
  };
};

export const createShiftAPI = {
  async createShift(shift: Shift[]): Promise<CreateShiftResponse[]> {
    const requestPayload = shift
      .map(createShiftRequest)
      .filter((payload): payload is CreateShiftResponse => payload !== null);
    
    // Don't send request if no valid shifts to create
    if (requestPayload.length === 0) {
      throw new Error("No valid shifts to create (all shifts are already published)");
    }

    const response = await fetch(`${BASE_URL}/shifts/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create shift: ${response.status} ${errorText}`);
    }

    return response.json();
  },
  

  async getShifts(): Promise<Shift[]> {
    const response = await fetch(
      `${BASE_URL}/shifts/${organizationId}/created`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Failed to fetch shifts");
    }
    return data.map(mapToShift);
  },

  async deleteShift(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/shifts/${id}/delete`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete shift");
    }
  },
};
