import Dexie, { Table } from 'dexie'

export interface CommodityPrice {
    id? : number;
    commodity: string;
    specification: string;
    unit: string;
    price: number;
    date_updated: Date;
}

export class CommodityDB extends Dexie {
    prices!: Table<CommodityPrice>

    constructor() {
        super("CommodityDatabase");
        this.version(1).stores({
            prices: '++id, commodity, date_updated'
        });
    }
}

export const db = new CommodityDB();