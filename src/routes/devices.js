const express = require("express");
const { getDevices, createDevice, updateDevice, deleteDevice } = require("../controllers/devicesController");

const router = express.Router();

router.get("/", getDevices);
router.post("/", createDevice);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);

module.exports = router;
