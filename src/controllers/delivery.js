import Delivery from '../models/Delivery.js';
import Stock from '../models/Stock.js';
import Movement from '../models/Movement.js';
import Location from '../models/Location.js';

export const create = async (req, res) => { try { res.status(201).json(await Delivery.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };
export const getAll = async (req, res) => { try { res.json(await Delivery.find().populate('products.product').populate('warehouse')); } catch (e) { res.status(500).json({ error: e.message }); } };
export const getOne = async (req, res) => { try { res.json(await Delivery.findById(req.params.id).populate('products.product').populate('warehouse')); } catch (e) { res.status(500).json({ error: e.message }); } };
export const update = async (req, res) => { try { res.json(await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { res.status(500).json({ error: e.message }); } };
export const remove = async (req, res) => { try { res.json(await Delivery.findByIdAndDelete(req.params.id)); } catch (e) { res.status(500).json({ error: e.message }); } };

export const validate = async (req, res) => {
    try {
        const delivery = await Delivery.findById(req.params.id);
        if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
        if (delivery.status === 'done') return res.status(400).json({ message: 'Already validated' });

        let locationId;
        const loc = await Location.findOne({ warehouse: delivery.warehouse });
        if (!loc) return res.status(400).json({ message: 'No location defined for this warehouse' });
        locationId = loc._id;

        for (let item of delivery.products) {
            let stock = await Stock.findOne({ product: item.product, location: locationId });
            if (!stock || stock.quantity < item.quantity) {
                return res.status(400).json({ message: 'Insufficient stock for product ' + item.product });
            }
        }

        for (let item of delivery.products) {
            let stock = await Stock.findOne({ product: item.product, location: locationId });
            stock.quantity -= item.quantity;
            await stock.save();

            await Movement.create({
                product: item.product,
                type: 'delivery',
                quantity: item.quantity,
                fromLocation: locationId,
                referenceId: delivery._id
            });
        }
        delivery.status = 'done';
        await delivery.save();
        res.json({ message: 'Delivery validated, stock reduced successfully', delivery });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
