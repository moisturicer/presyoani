import { CommodityPrice, db } from '../lib/dexie'
import { supabase } from '../lib/supabaseClient'


export class SyncService {

    static async syncCommodities() {

        const latestLocal = await db.prices.orderBy("date_updated").last() as CommodityPrice | undefined;

        const lastTimestamp = latestLocal?.date_updated ?? new Date(0).toISOString();

        console.log(`Syncing prices updated after: ${new Date(lastTimestamp)}`);

        const { data, error } = await supabase
            .from('dpi_prices') 
            .select('*')
            .gt('date_updated', lastTimestamp) 
            .order('date_updated', { ascending: true })
            .limit(1000);

        if (error) {
            console.error('Supabase fetch error:', error);
            return;
        }

        console.log('Raw data from Supabase:', data); 

        if (data && data.length > 0) {
            try {
                await db.prices.bulkPut(data);
                console.log(`Successfully synced ${data.length} records.`);
            } catch (dbError) {
                console.error('Dexie storage error:', dbError); 
            }
        } else {
            console.log('Local database is already up to date.');
        }
        
    }
}

