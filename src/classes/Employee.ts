import Store from "../store/store";
import IEmployee from "../interfaces/Employee";
import { IMockDataType } from "../interfaces/MockDataType";

class Employee implements IEmployee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];

  constructor(data: IMockDataType) {
    this.uniqueId = Store.getId();
    this.name = Object.keys(data)[0];
    this.subordinates = this.getSubordinates(data);
  }

  getSubordinates(data: IMockDataType): Employee[] {
    const objectValue = data[Object.keys(data)[0]];
    if (objectValue !== undefined) {
      const arr: Employee[] = [];
      Object.keys(objectValue).forEach((key) => {
        // Create employee subordinates
        const employee = new Employee({
          [key]: (objectValue as IMockDataType)[key],
        });
        arr.push(employee);
      });
      return arr;
    }
    return [];
  }

  removeSubordinate(id: number): Employee[] {
    for (let i = 0; i < this.subordinates.length; i++) {
      if (this.subordinates[i].uniqueId === id) {
        this.subordinates.splice(i, 1);
        break;
      }
    }
    return this.subordinates;
  }

  addSubordinate(subordinate: Employee): Employee[] {
    this.subordinates.push(subordinate);
    return this.subordinates;
  }

  findById(id: number): { target: Employee; parent?: Employee } | null {
    if (this.uniqueId === id) return { target: this };
    else {
      for (let i = 0; i < this.subordinates.length; i++) {
        if (this.subordinates[i].uniqueId === id) {
          return {
            target: this.subordinates[i],
            parent: this,
          };
        } else {
          let result = this.subordinates[i].findById(id);
          if (result) return result;
        }
      }
    }
    return null;
  }
}

export default Employee;
