import Movement from '../models/Movement.js';

export const getAll = async (req, res) => { try { res.json(await Movement.find().populate('product fromLocation toLocation').sort({createdAt:-1})); } catch(e) { res.status(500).json({error:e.message}); } };
export const getByProduct = async (req, res) => { try { res.json(await Movement.find({product: req.params.productId}).populate('product fromLocation toLocation').sort({createdAt:-1})); } catch(e) { res.status(500).json({error:e.message}); } };
export const getByLocation = async (req, res) => { try { res.json(await Movement.find({$or: [{fromLocation: req.params.locationId}, {toLocation: req.params.locationId}]}).populate('product fromLocation toLocation').sort({createdAt:-1})); } catch(e) { res.status(500).json({error:e.message}); } };
