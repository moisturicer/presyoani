import { CommodityPrice, db } from '../lib/dexie'
import { supabase } from '../lib/supabaseClient'


export class SyncService {

    static async syncCommodities() {

        const latestLocal = await db.prices.orderBy('created_at').last() as CommodityPrice | undefined;

        const lastTimestamp = latestLocal?.created_at ?? 0;

        console.log(`Syncing prices updated after: ${new Date(lastTimestamp)}`);

        const { data, error } = await supabase
            .from('commodity_prices') 
            .select('*')
            .gt('created_at', lastTimestamp) 
            .order('created_at', { ascending: true })
            .limit(1000);

        if (error) {
            console.error('Supabase fetch error:', error);
            return;
        }

        if (data && data.length > 0) {
            
            await db.prices.bulkPut(data);
            
            console.log(`Successfully synced ${data.length} records.`);

            if (data.length === 1000) {
                await this.syncCommodities();
            }
        } else {
            console.log('Local database is already up to date.');
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