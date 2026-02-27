import { db } from '../lib/dexie'

export class SyncService {

    static async startSync(offsetTimestamp: number = 0) {
        console.log("Sync started from: ", new Date(offsetTimestamp));

        try {
            const response = await fetch(`/api/prices?since=${offsetTimestamp}`);
            const data = await response.json();

            if (data && data.length > 0) {
                
                await db.prices.bulkPut(data);

                const lastTs = data[data.length - 1].timestamp;

                await this.startSync(lastTs);
            } else {
                console.log("Sync complete. Local database is up to date");
            }
        } catch (error) {
            console.error("Sync interrupted: ", error);
        }
    }
}

// this code is for the main app or entry but further clarification is needed
// import { SyncService } from './services/SyncService';


// window.addEventListener('online', async () => {
//  
//   const lastEntry = await db.prices.orderBy('timestamp').last();
//   const startTime = lastEntry ? lastEntry.timestamp : 0;
  
//   SyncService.startSync(startTime);
// });