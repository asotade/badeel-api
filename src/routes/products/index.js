const { Router } = require('express');
const { makeFilters } = require('../../utils/helper');
const { productService } = require('../../services');

const router = Router();

router.get('/', async (req, res) => {
  const filter = makeFilters(req.query);
  const { code, result } = await productService.findAll(filter);
  return res.status(200).json({ code, result });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { result } = await productService.findOne(id);
  return res.status(200).json({ code: 0, result });
});

router.post('/', async (req, res) => {
  const { body } = req;
  try {
    const { result, code } = await productService.createOne(body);
    return res.status(200).json({ code, result });
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.put('/:id/assign/:recomended', async (req, res) => {
  const { params: { recomended, id } } = req;

  try {
    const { result, code } = await productService.assignProduct(id, recomended);
    return res.status(200).json({ code, result });
  } catch (err) {
    return res.status(500).json({ code: 500, result: err });
  }
});

router.put('/:id/unassign/:recomended', async (req, res) => {
  const { params: { recomended, id } } = req;

  try {
    const { result, code } = await productService.unassignProduct(id, recomended);
    return res.status(200).json({ code, result });
  } catch (err) {
    return res.status(500).json({ code: 500, result: err });
  }
});

module.exports = router;
