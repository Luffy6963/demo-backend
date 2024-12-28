import Seller from '../models/Seller.js';

export async function getSellerInfo(req, res) {
  try {
    const seller = await Seller.findOne({
      where: { id: req.seller.id },
      attributes: ['name', 'email', 'phone']
    });

    if(!seller) {
      return res.status(404).json({ error: 'Seller not found.' });
    }
    return res.json({
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      id: seller.id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

export async function getAllSellerInfo(req, res) {
  try {
    const seller = await Seller.findAll(
    );

    if(!seller) {
      return res.status(404).json({ error: 'Seller not found.' });
    }
    return res.json({
      seller: seller
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}