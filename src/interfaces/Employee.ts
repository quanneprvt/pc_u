interface IEmployee {
  uniqueId: number;
  name: string;
  subordinates: IEmployee[];
}

export default IEmployee;