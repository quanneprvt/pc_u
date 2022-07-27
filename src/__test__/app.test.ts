// Add employee cases to this file
import data from "./employee.test.json";
import Employee from "../classes/Employee";
import EmployeeOrgApp from "../classes/EmployeeOrgApp";
import { IMockDataType } from "../interfaces/MockDataType";

test.each(data)("Create CEO Employee", (testCase: IMockDataType) => {
  const ceo = new Employee(testCase);
  new EmployeeOrgApp(ceo);
  const subordinates = testCase[Object.keys(testCase)[0]];
  let count = 0;
  for (let a in subordinates) a && count++;
  expect(ceo.subordinates.length).toBe(count);
});

// First number is employeeId, second is supervisorId
const moveIdCases = [
  [8, 2],
  [3, 4],
  [5, 6],
];

test.each(data)("Move/Undo/Redo", async (testCase) => {
  const ceo = new Employee(testCase);
  const app = new EmployeeOrgApp(ceo);
  const testResult: boolean[] = [];
  await Promise.all(
    moveIdCases.map(async (arrCase) => {
      const origApp = JSON.stringify(app.ceo);
      // Move test
      const move = app.move(arrCase[0], arrCase[1]);
      const moveApp = JSON.stringify(app.ceo);
      if (move === null) {
        testResult.push(true);
        return arrCase;
      }
      let subordinates = app.ceo
        // eslint-disable-next-line testing-library/await-async-query
        .findById(arrCase[1])
        ?.target.subordinates.filter(
          (subordinate) => subordinate.uniqueId === arrCase[0]
        );
      if (subordinates && subordinates?.length > 0) testResult.push(true);
      // Undo test
      app.undo();
      const undoApp = JSON.stringify(app.ceo);
      if (origApp === undoApp) testResult.push(true);
      // Redo test
      app.redo();
      const redoApp = JSON.stringify(app.ceo);
      if (redoApp === moveApp) testResult.push(true);
    })
  );
  const result = testResult.every((v) => v === true);
  expect(result).toBe(true);
});
