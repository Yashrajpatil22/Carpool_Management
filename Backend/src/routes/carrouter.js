import express from "express";
import Car from "../models/car.model.js";

const carRouter = express.Router();

carRouter.post("/add", async (req, res) => {
    const { user_id, model, company, plate_number, color, number_of_seats, year_of_manufacture } = req.body;

    try {
        const car = new Car({
            user_id,
            model,
            company,
            plate_number,
            color,
            number_of_seats,
            year_of_manufacture
        }); 
        await car.save();
        res.status(201).json(car);
    } catch (error) {
        res.status(500).send("Server error");
    }
});

carRouter.get("/my", async (req, res) => {
  const { user_id } = req.query;
  try {
    if (!user_id) {
      return res.status(400).send("user_id is required");
    }
    const cars = await Car.find({ user_id });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

carRouter.put("/:carId", async (req, res) => {
  const { carId } = req.params;
  const updateData = req.body;

  try {
    const updatedCar = await Car.findByIdAndUpdate(carId, updateData, {
      new: true,
    });
    if (!updatedCar) {
      return res.status(404).send("Car not found");
    }
    res.status(200).json(updatedCar);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

carRouter.delete("/:carId", async (req, res) => {
  const { carId } = req.params;
  try {
    const deletedCar = await Car.findByIdAndDelete(carId);
    if (!deletedCar) {
      return res.status(404).send("Car not found");
    }
    res.status(200).json(deletedCar);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export default carRouter;