// Personal Schedule Interfaces
export interface PersonalShift {
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


const employeeId = "123e4567-e89b-12d3-a456-426655440003";


export const personalScheduleAPI = {
    getShiftsByEmployee: async (): Promise<PersonalShift[]> => {
        const response = await fetch(`http://localhost:8080/api/rosterAssignments/employee/${employeeId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    }

}