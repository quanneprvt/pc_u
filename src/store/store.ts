import IStore from "../interfaces/Store";

class Store implements IStore {
  idCount: number;

  constructor() {
    this.idCount = 0;
  }

  getId() {
    return (this.idCount += 1);
  }
}

export default new Store();
