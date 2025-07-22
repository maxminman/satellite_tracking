import { 
  Satellite, 
  SatellitePosition, 
  SpaceWeatherData, 
  ValidationResult, 
  SystemConfiguration,
  User,
  InsertSatellite, 
  InsertPosition, 
  InsertSpaceWeather, 
  InsertValidation, 
  InsertConfig,
  InsertUser
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Satellite management
  getSatellite(noradId: string): Promise<Satellite | undefined>;
  getSatellites(): Promise<Satellite[]>;
  createSatellite(satellite: InsertSatellite): Promise<Satellite>;
  updateSatellite(noradId: string, satellite: Partial<InsertSatellite>): Promise<Satellite | undefined>;

  // Position tracking
  getLatestPosition(noradId: string): Promise<SatellitePosition | undefined>;
  getPositionHistory(noradId: string, limit?: number): Promise<SatellitePosition[]>;
  createPosition(position: InsertPosition): Promise<SatellitePosition>;

  // Space weather
  getLatestSpaceWeather(): Promise<SpaceWeatherData | undefined>;
  getSpaceWeatherHistory(limit?: number): Promise<SpaceWeatherData[]>;
  createSpaceWeather(data: InsertSpaceWeather): Promise<SpaceWeatherData>;

  // Validation
  getValidationResults(noradId?: string, limit?: number): Promise<ValidationResult[]>;
  createValidationResult(result: InsertValidation): Promise<ValidationResult>;

  // Configuration
  getConfiguration(key: string): Promise<SystemConfiguration | undefined>;
  setConfiguration(config: InsertConfig): Promise<SystemConfiguration>;
  getAllConfiguration(): Promise<SystemConfiguration[]>;

  // Statistics
  getSystemStats(): Promise<{
    totalSatellites: number;
    avgAccuracy: number;
    validatedSatellites: number;
    apiCallsToday: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private satellites: Map<string, Satellite>;
  private positions: Map<string, SatellitePosition[]>;
  private spaceWeather: SpaceWeatherData[];
  private validationResults: ValidationResult[];
  private configuration: Map<string, SystemConfiguration>;
  
  private currentUserId: number;
  private currentSatelliteId: number;
  private currentPositionId: number;
  private currentSpaceWeatherId: number;
  private currentValidationId: number;
  private currentConfigId: number;

  constructor() {
    this.users = new Map();
    this.satellites = new Map();
    this.positions = new Map();
    this.spaceWeather = [];
    this.validationResults = [];
    this.configuration = new Map();
    
    this.currentUserId = 1;
    this.currentSatelliteId = 1;
    this.currentPositionId = 1;
    this.currentSpaceWeatherId = 1;
    this.currentValidationId = 1;
    this.currentConfigId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSatellite(noradId: string): Promise<Satellite | undefined> {
    return this.satellites.get(noradId);
  }

  async getSatellites(): Promise<Satellite[]> {
    return Array.from(this.satellites.values());
  }

  async createSatellite(insertSatellite: InsertSatellite): Promise<Satellite> {
    const id = this.currentSatelliteId++;
    const satellite: Satellite = { 
      ...insertSatellite,
      id,
      dragCoefficient: insertSatellite.dragCoefficient ?? null,
      crossSectionalArea: insertSatellite.crossSectionalArea ?? null,
      mass: insertSatellite.mass ?? null,
      lastUpdated: new Date()
    };
    this.satellites.set(insertSatellite.noradId, satellite);
    return satellite;
  }

  async updateSatellite(noradId: string, update: Partial<InsertSatellite>): Promise<Satellite | undefined> {
    const existing = this.satellites.get(noradId);
    if (!existing) return undefined;

    const updated: Satellite = { 
      ...existing, 
      ...update, 
      lastUpdated: new Date()
    };
    this.satellites.set(noradId, updated);
    return updated;
  }

  async getLatestPosition(noradId: string): Promise<SatellitePosition | undefined> {
    const positions = this.positions.get(noradId) || [];
    return positions.length > 0 ? positions[positions.length - 1] : undefined;
  }

  async getPositionHistory(noradId: string, limit: number = 100): Promise<SatellitePosition[]> {
    const positions = this.positions.get(noradId) || [];
    return positions.slice(-limit);
  }

  async createPosition(insertPosition: InsertPosition): Promise<SatellitePosition> {
    const id = this.currentPositionId++;
    const position: SatellitePosition = { 
      ...insertPosition, 
      id,
      method: insertPosition.method || 'enhanced',
      accuracyEstimate: insertPosition.accuracyEstimate ?? null
    };
    
    if (!this.positions.has(insertPosition.noradId)) {
      this.positions.set(insertPosition.noradId, []);
    }
    
    this.positions.get(insertPosition.noradId)!.push(position);
    return position;
  }

  async getLatestSpaceWeather(): Promise<SpaceWeatherData | undefined> {
    return this.spaceWeather.length > 0 ? 
      this.spaceWeather[this.spaceWeather.length - 1] : undefined;
  }

  async getSpaceWeatherHistory(limit: number = 100): Promise<SpaceWeatherData[]> {
    return this.spaceWeather.slice(-limit);
  }

  async createSpaceWeather(insertData: InsertSpaceWeather): Promise<SpaceWeatherData> {
    const id = this.currentSpaceWeatherId++;
    const data: SpaceWeatherData = { 
      ...insertData, 
      id,
      source: insertData.source || 'NOAA',
      dstIndex: insertData.dstIndex ?? null
    };
    this.spaceWeather.push(data);
    return data;
  }

  async getValidationResults(noradId?: string, limit: number = 100): Promise<ValidationResult[]> {
    let results = this.validationResults;
    if (noradId) {
      results = results.filter(r => r.noradId === noradId);
    }
    return results.slice(-limit);
  }

  async createValidationResult(insertResult: InsertValidation): Promise<ValidationResult> {
    const id = this.currentValidationId++;
    const result: ValidationResult = { ...insertResult, id };
    this.validationResults.push(result);
    return result;
  }

  async getConfiguration(key: string): Promise<SystemConfiguration | undefined> {
    return this.configuration.get(key);
  }

  async setConfiguration(insertConfig: InsertConfig): Promise<SystemConfiguration> {
    const existing = this.configuration.get(insertConfig.key);
    if (existing) {
      const updated: SystemConfiguration = {
        ...existing,
        value: insertConfig.value,
        lastUpdated: new Date()
      };
      this.configuration.set(insertConfig.key, updated);
      return updated;
    } else {
      const id = this.currentConfigId++;
      const config: SystemConfiguration = { 
        ...insertConfig, 
        id, 
        lastUpdated: new Date() 
      };
      this.configuration.set(insertConfig.key, config);
      return config;
    }
  }

  async getAllConfiguration(): Promise<SystemConfiguration[]> {
    return Array.from(this.configuration.values());
  }

  async getSystemStats(): Promise<{
    totalSatellites: number;
    avgAccuracy: number;
    validatedSatellites: number;
    apiCallsToday: number;
  }> {
    const totalSatellites = this.satellites.size;
    
    // Calculate average accuracy from recent validation results
    const recentValidations = this.validationResults.slice(-100);
    const avgAccuracy = recentValidations.length > 0 ? 
      recentValidations.reduce((sum, v) => sum + v.errorDistance, 0) / recentValidations.length : 0;

    const validatedSatellites = new Set(this.validationResults.map(v => v.noradId)).size;
    
    // Mock API calls for now - in real implementation this would track actual usage
    const apiCallsToday = Math.floor(Math.random() * 10000) + 5000;

    return {
      totalSatellites,
      avgAccuracy: Math.round(avgAccuracy),
      validatedSatellites,
      apiCallsToday
    };
  }
}

export const storage = new MemStorage();
