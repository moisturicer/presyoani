import Dexie, { Table } from 'dexie'

export interface CommodityPrice {
    id? : number;
    commodity: string;
    specification: string;
    unit: string;
    price: number;
    created_at?: string;
}

export class CommodityDB extends Dexie {
    prices!: Table<CommodityPrice>

    constructor() {
        super("CommodityDatabase");
        this.version(2).stores({
        prices: '++id, commodity, created_at'
    });
    }
}

export const db = new CommodityDB();