import Employee from "./Employee";
import { IEmployeeOrgApp, IAction } from "../interfaces/EmployeeApp";

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  log: IAction[];
  currentLog: number;

  constructor(ceo: Employee) {
    this.ceo = ceo;
    this.currentLog = 0;
    this.log = [];
  }

  move(employeeId: number, supervisorId: number): void {
    const employee = this.ceo.findById(employeeId);
    const supervisor = this.ceo.findById(supervisorId);
    if (!employee || !supervisor) return;
    //
    if (employee.target.findById(supervisorId)) {
      employee.parent?.addSubordinate(supervisor.target);
      supervisor.parent &&
        supervisor.parent.removeSubordinate(supervisor.target.uniqueId);
      employee.parent && employee.parent.removeSubordinate(employeeId);
      supervisor.target.addSubordinate(employee.target);
    } else {
      employee.parent?.removeSubordinate(employee.target.uniqueId);
      supervisor.target.addSubordinate(employee.target);
    }
    if (this.currentLog === this.log.length) {
      // logging
      const action: IAction = {
        action: (params: any[]) => this.move(params[0], params[1]),
        undo: [employeeId, employee.parent?.uniqueId],
        redo: [employeeId, supervisor.target.uniqueId],
      };
      this.log.push(action);
    }
    this.currentLog++;
    return;
  }

  undo(): void {
    const log: IAction = this.getLog();
    if (!log) return;
    log.action(log.undo);
  }

  redo(): void {
    const log: IAction = this.getLog();
    if (!log) return;
    log.action(log.redo);
  }

  getLog(): IAction {
    this.currentLog--;
    return this.log[this.currentLog];
  }
}

export default EmployeeOrgApp;
