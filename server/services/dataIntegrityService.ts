/**
 * Data Integrity Service - Ensures only authentic data is served
 * NO MOCK DATA, NO FALLBACKS, NO SYNTHETIC DATA
 */

export class DataIntegrityService {
  private static instance: DataIntegrityService;
  private dataStatus: Map<string, { isReal: boolean; lastChecked: Date; source: string }> = new Map();

  static getInstance(): DataIntegrityService {
    if (!this.instance) {
      this.instance = new DataIntegrityService();
    }
    return this.instance;
  }

  markDataAsReal(dataType: string, source: string): void {
    this.dataStatus.set(dataType, {
      isReal: true,
      lastChecked: new Date(),
      source
    });
    console.log(`✅ REAL DATA: ${dataType} from ${source}`);
  }

  markDataAsUnavailable(dataType: string, reason: string): void {
    this.dataStatus.set(dataType, {
      isReal: false,
      lastChecked: new Date(),
      source: `UNAVAILABLE: ${reason}`
    });
    console.log(`❌ NO DATA: ${dataType} - ${reason}`);
  }

  isDataReal(dataType: string): boolean {
    const status = this.dataStatus.get(dataType);
    return status?.isReal ?? false;
  }

  getDataStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    for (const [key, value] of this.dataStatus.entries()) {
      status[key] = {
        isReal: value.isReal,
        source: value.source,
        lastChecked: value.lastChecked.toISOString()
      };
    }
    return status;
  }

  validateDataIntegrity(): void {
    console.log('\n🔍 DATA INTEGRITY CHECK:');
    for (const [dataType, status] of this.dataStatus.entries()) {
      const icon = status.isReal ? '✅' : '❌';
      console.log(`${icon} ${dataType}: ${status.source}`);
    }
    console.log('');
  }

  // Throw error if attempting to use fake data
  preventFakeData(dataType: string, data: any): void {
    if (!this.isDataReal(dataType)) {
      throw new Error(`INTEGRITY VIOLATION: Attempted to use non-authentic ${dataType} data. System configured for real data only.`);
    }
  }
}