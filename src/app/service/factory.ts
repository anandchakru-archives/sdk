// Simplified version of https://github.com/microsoft/tsyringe
export class ServiceFactory {
  // singleton
  public static instance(): ServiceFactory {
    if (!ServiceFactory.i) {
      ServiceFactory.i = new ServiceFactory();
    }
    return ServiceFactory.i;
  }
  private static i: ServiceFactory;
  // methods
  private beans = new Map();
  private constructor() { }
  public create(id: string, bean: any): any {
    this.beans.set(id, bean);
    return bean;
  }
  public get(id: string): any {
    return this.beans.get(id);
  }

}