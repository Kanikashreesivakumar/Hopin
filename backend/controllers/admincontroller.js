const supabase = require('../supabaseClient');

const addEvent = async (req, res) => {
  const { title, date, location } = req.body;

  const { data, error } = await supabase
    .from('events')
    .insert([{ title, date, location }]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: 'Event added', data });
};

const manageEvents = async (req, res) => {
  const { data, error } = await supabase.from('events').select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};

const getAdminRides = async (req, res) => {
  const { data, error } = await supabase.from('rides').select('*');

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json(data);
};

module.exports = { addEvent, manageEvents, getAdminRides };
