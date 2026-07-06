import { BaseModel } from './BaseModel.js';

export class Tarif extends BaseModel {
    constructor(db) {
        super('tarif', db);
    }

    async searchTarif(kota_asal, kota_tujuan) {
        try {
            const [rows] = await this.db.query(
                `SELECT * FROM tarif 
                 WHERE kota_asal LIKE ? AND kota_tujuan LIKE ?`,
                [`%${kota_asal}%`, `%${kota_tujuan}%`]
            );
            return rows;
        } catch (error) {
            throw new Error(`Error searching tarif: ${error.message}`);
        }
    }

    async getAllKota() {
        try {
            const [asal] = await this.db.query('SELECT DISTINCT kota_asal FROM tarif');
            const [tujuan] = await this.db.query('SELECT DISTINCT kota_tujuan FROM tarif');
            return {
                kota_asal: asal.map(k => k.kota_asal),
                kota_tujuan: tujuan.map(k => k.kota_tujuan)
            };
        } catch (error) {
            throw new Error(`Error getting cities: ${error.message}`);
        }
    }
}