import User from '../model/User.js';

const fetchUserByAddress = async (req, res) => {
  const { address } = req.params;
  try {
    const user = await User.findOne({ address: { $eq: address} });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createUser = async (req, res) => {
  const { address } = req.params;
  const { name, email, bio, avatar } = req.body;
  try {
    const foundUserByAddress = email ? await User.findOne({ address: {$eq: address} }) : null;
    const foundUserByEmail = email ? await User.findOne({ email: {$eq: email} }) : null;

    if (foundUserByEmail || foundUserByAddress) {
      return res.status(202).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ address, name, email, bio, avatar });
      await newUser.save();
      return res.status(201).json({ message: 'User Details Saved' });
    }
    res.status(201).json(query);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndUpdate(id, req.body, {new:true});
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
};

export { fetchUserByAddress, createUser, updateUser }
