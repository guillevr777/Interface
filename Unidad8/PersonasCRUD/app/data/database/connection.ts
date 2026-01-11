export class Connection {
  private static instance: Connection | null = null;
  private readonly baseURL: string;

  private constructor() {
    this.baseURL = "https://ui20251201140912-echufmbcephkfyfc.francecentral-01.azurewebsites.net/api";
  }

  static getConnection(): Connection {
    if (Connection.instance === null) {
      Connection.instance = new Connection();
    }
    return Connection.instance;
  }

  getBaseURL(): string {
    return this.baseURL;
  }
}

// Export default también por si acaso
export default Connection;