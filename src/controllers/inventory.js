import Stock from '../models/Stock.js';

export const getAll = async (req, res) => { try { res.json(await Stock.find().populate('product location')); } catch(e) { res.status(500).json({error:e.message}); } };
export const getByProduct = async (req, res) => { try { res.json(await Stock.find({product: req.params.productId}).populate('product location')); } catch(e) { res.status(500).json({error:e.message}); } };
export const getByLocation = async (req, res) => { try { res.json(await Stock.find({location: req.params.locationId}).populate('product location')); } catch(e) { res.status(500).json({error:e.message}); } };
