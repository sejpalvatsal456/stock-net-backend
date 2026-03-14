import Category from '../models/Category.js';

export const create = async (req, res) => { try { res.status(201).json(await Category.create(req.body)); } catch (e) { res.status(500).json({ error: e.message }); } };

export const getAll = async (req, res) => {
    try {
        let query = Category.find();
        
        
        res.json(await query);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const getOne = async (req, res) => {
    try {
        let query = Category.findById(req.params.id);
        
        
        const result = await query;
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const update = async (req, res) => {
    try {
        const result = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
};

export const remove = async (req, res) => {
    try {
        const result = await Category.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (e) { res.status(500).json({ error: e.message }); }
};

