import Dexie, { Table } from 'dexie'

export interface CommodityPrice {
    id? : number;
    code: string;
    timestamp: number;
    price: number;
}
export class CommodityDB extends Dexie {
    prices!: Table<CommodityDB>

    constructor() {
        super("CommodityDatabase");
        this.version(1).stores({
            prices: '++id, code, timestamp'
        });
    }
}

export const db = new CommodityDB();