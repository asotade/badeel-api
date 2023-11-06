const { Router } = require('express');
const { countriesService } = require('../../services');

const router = Router();

router.get('/', async (req, res) => {
  const { code, result } = await countriesService.findAll();
  return res.status(200).json({ code, result });
});

module.exports = router;
