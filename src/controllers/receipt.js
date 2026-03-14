import Receipt from '../models/Receipt.js';
import Stock from '../models/Stock.js';
import Movement from '../models/Movement.js';
import Location from '../models/Location.js';

export const create = async (req, res) => { try { res.status(201).json(await Receipt.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };
export const getAll = async (req, res) => { try { res.json(await Receipt.find().populate('products.product').populate('warehouse')); } catch (e) { res.status(500).json({ error: e.message }); } };
export const getOne = async (req, res) => { try { res.json(await Receipt.findById(req.params.id).populate('products.product').populate('warehouse')); } catch (e) { res.status(500).json({ error: e.message }); } };
export const update = async (req, res) => { try { res.json(await Receipt.findByIdAndUpdate(req.params.id, req.body, {new: true})); } catch (e) { res.status(500).json({ error: e.message }); } };
export const remove = async (req, res) => { try { res.json(await Receipt.findByIdAndDelete(req.params.id)); } catch (e) { res.status(500).json({ error: e.message }); } };

export const validate = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id);
        if (!receipt) return res.status(404).json({ message: 'Receipt not found' });
        if (receipt.status === 'done') return res.status(400).json({ message: 'Already validated' });
        
        let locationId;
        if (receipt.products.length > 0 && req.body.locationId) {
             locationId = req.body.locationId;
        } else {
             const loc = await Location.findOne({ warehouse: receipt.warehouse });
             if (!loc) return res.status(400).json({ message: 'No location defined for this warehouse' });
             locationId = loc._id;
        }

        for (let item of receipt.products) {
            let stock = await Stock.findOne({ product: item.product, location: locationId });
            if (stock) {
                stock.quantity += item.quantity;
                await stock.save();
            } else {
                await Stock.create({ product: item.product, location: locationId, quantity: item.quantity });
            }
            await Movement.create({
                product: item.product,
                type: 'receipt',
                quantity: item.quantity,
                toLocation: locationId,
                referenceId: receipt._id
            });
        }
        receipt.status = 'done';
        await receipt.save();
        res.json({ message: 'Receipt validated, stock updated successfully', receipt });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
