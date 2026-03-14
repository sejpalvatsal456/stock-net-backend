import Location from '../models/Location.js';

export const create = async (req, res) => { try { res.status(201).json(await Location.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };

export const getAll = async (req, res) => {
    try {
        let query = Location.find();
        
        query = query.populate('warehouse');
        res.json(await query);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOne = async (req, res) => {
    try {
        let query = Location.findById(req.params.id);
        
        query = query.populate('warehouse');
        const result = await query;
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const update = async (req, res) => {
    try {
        const result = await Location.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const remove = async (req, res) => {
    try {
        const result = await Location.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

