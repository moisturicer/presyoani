import Dexie, { Table } from 'dexie'

export interface CommodityPrice {
    id? : number;
    commodity: string;
    specification: string;
    unit: string;
    price: number;

    timestamp: number;
}

export class CommodityDB extends Dexie {
    prices!: Table<CommodityDB>

    constructor() {
        super("CommodityDatabase");
        this.version(1).stores({
        prices: '++id, commodity, timestamp, [commodity+timestamp]'
    });
    }
}

export const db = new CommodityDB();