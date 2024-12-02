const express = require('express');
const router = express.Router();
const Routes = require('../models/routes'); // Ensure the path to your model is correct

// 1. Create a new route
router.post('/create', async (req, res) => {
    try {
        const route = await Routes.create(req.body);
        res.status(201).json(route); // 201 Created status
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

// 2. Get all routes
router.get('/getAll', async (req, res) => {
    try {
        const routes = await Routes.find({});
        res.status(200).json(routes);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// 3. Update a route by routesID
router.put('/update/:routesID', async (req, res) => {
    const { routesID } = req.params;
    const { routeName, coveredPlaces } = req.body; // Destructure both fields

    try {
        const updatedRoute = await Routes.findOneAndUpdate(
            { routesID }, 
            { routeName, coveredPlaces },  // Pass both fields in the update object
            { new: true }  // Ensure the updated document is returned
        )
        .select('routesID routeName coveredPlaces'); // Select only the fields you want to return

        if (!updatedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }

        res.status(200).json(updatedRoute);  // Return only the selected fields
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});


// 4. Delete a route by routesID
router.delete('/delete/:routesID', async (req, res) => {
    const { routesID } = req.params;

    try {
        const deletedRoute = await Routes.findOneAndDelete({ routesID });

        if (!deletedRoute) {
            return res.status(404).json({ message: 'Route not found' });
        }

        res.status(200).json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
