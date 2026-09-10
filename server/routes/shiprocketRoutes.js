import express from "express";

import {
  getShiprocketToken,
  getAvailableCouriers,
  generateAWB,
} from "../config/shiprocket.js";

const router = express.Router();

// ==========================================
// TEST SHIPROCKET CONNECTION
// ==========================================

router.get("/test", async (req, res) => {
  try {
    const token = await getShiprocketToken();

    return res.status(200).json({
      success: true,
      message:
        "Shiprocket API connected successfully",
      tokenReceived: !!token,
    });
  } catch (error) {
    console.error(
      "Shiprocket test error:",
      error.response?.data ||
        error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Shiprocket API connection failed",
      error:
        error.response?.data ||
        error.message,
    });
  }
});

// ==========================================
// CHECK AVAILABLE COURIERS
// ==========================================

router.get(
  "/couriers",
  async (req, res) => {
    try {
      const {
        pickupPostcode,
        deliveryPostcode,
        weight,
        cod,
      } = req.query;

      // ==========================================
      // VALIDATION
      // ==========================================

      if (
        !pickupPostcode ||
        !deliveryPostcode
      ) {
        return res.status(400).json({
          success: false,
          message:
            "pickupPostcode and deliveryPostcode are required",
        });
      }

      // ==========================================
      // GET AVAILABLE COURIERS
      // ==========================================

      const courierData =
        await getAvailableCouriers({
          pickupPostcode,
          deliveryPostcode,
          weight: weight || 0.5,
          cod: cod || 1,
        });

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      return res.status(200).json({
        success: true,
        message:
          "Available couriers fetched successfully",
        data: courierData,
      });
    } catch (error) {
      console.error(
        "❌ Courier serviceability error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch available couriers",
        error:
          error.response?.data ||
          error.message,
      });
    }
  }
);

// ==========================================
// GENERATE AWB
// ==========================================

router.post(
  "/awb",
  async (req, res) => {
    try {
      const {
        shipmentId,
        courierCompanyId,
      } = req.body;

      // ==========================================
      // VALIDATION
      // ==========================================

      if (!shipmentId) {
        return res.status(400).json({
          success: false,
          message:
            "shipmentId is required",
        });
      }

      if (!courierCompanyId) {
        return res.status(400).json({
          success: false,
          message:
            "courierCompanyId is required",
        });
      }

      // ==========================================
      // GENERATE AWB
      // ==========================================

      const awbData =
        await generateAWB(
          shipmentId,
          courierCompanyId
        );

      // ==========================================
      // SUCCESS RESPONSE
      // ==========================================

      return res.status(200).json({
        success: true,
        message:
          "AWB generated successfully",
        data: awbData,
      });
    } catch (error) {
      console.error(
        "❌ AWB generation route error:",
        error.response?.data ||
          error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to generate AWB",
        error:
          error.response?.data ||
          error.message,
      });
    }
  }
);

export default router;