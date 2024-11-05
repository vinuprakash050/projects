const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Client } = require('pg'); // Import the pg Client

const app = express();
const port = 5000;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
const con = new Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "1dragvin",
    database: "project"
});

con.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error('Connection error', err.stack));

// Route to get products from PostgreSQL
app.get('/api/products', async (req, res) => {
    console.log('Request received at /api/products'); // Debugging log
    try {
        const result = await con.query("SELECT * FROM public.products ORDER BY id ASC");
        res.json(result.rows); // Send the products array as JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Register request received:', req.body); // Log the request body
    try {
        // Check if the email or username already exists
        const emailCheck = await con.query('SELECT * FROM public.users WHERE email = $1', [email]);
        const nameCheck = await con.query('SELECT * FROM public.users WHERE name = $1', [name]);

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (nameCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Insert the new user
        const result = await con.query(
            'INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        const user = result.rows;
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: jwt.sign({ id: user.id, email: user.email, name: user.name }, 'secret', { expiresIn: '1h' }),
        });
    } catch (err) {
        console.error('Error during registration:', err); // Log the error
        res.status(500).send('Server error');
    }
});


// Product routes
app.get('/api/products/:id', async (req, res) => {
    console.log('Request received at /api/products/:id'); // Debugging log
    const productId = req.params.id;
    try {
        const result = await con.query("SELECT * FROM public.products WHERE id = $1", [productId]);
        console.log("result",result); // Log the raw result from the database
        if (result.rows.length > 0) {
            const product = result.rows[0];
            console.log(product); // Log the product object to check its structure
            const formattedProduct = {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                brand: product.brand,
                rating: product.rating,
                numreviews: product.numreviews,
                description: product.description,
                category: product.category,
                material: product.material,
                color: product.color,
                size: product.size,
                careinstructions: product.careinstructions
            };
            console.log(formattedProduct); // Log the formatted product to the console
            res.json(formattedProduct); // Send the formatted product as JSON
        } else {
            res.status(404).send({ msg: "Product not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});


app.post('/api/users/signin', async (req, res) => {
    const { email, password } = req.body;
    console.log('Email:', email);
    console.log('Password:', password);
    try {
        const result = await con.query("SELECT * FROM public.users WHERE email = $1", [email]);
        console.log('User data received:', result.rows); // Log the user data to the console
        if (result.rows.length > 0) {
            const user = result.rows[0]; // Access the first user in the array
            console.log('User object:', user); // Log the entire user object
            console.log('User password:', user.password);
            console.log('Entered password:', password);
            if (user.password === password) {
                res.json({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: jwt.sign({ id: user.id, email: user.email, name: user.name }, 'secret', { expiresIn: '1h' }),
                });
            } else {
                console.log('Password mismatch');
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            console.log('User not found');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error during sign-in:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/users/:userId/total-quantity', async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await con.query('SELECT total_quantity FROM public.users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { total_quantity } = result.rows[0];
        res.status(200).json({ totalQuantity: total_quantity });
    } catch (err) {
        console.error('Error fetching total quantity:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/users/remove-from-cart', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        // Fetch the current cart details
        const result = await con.query('SELECT cart_product_ids, cart_quantity FROM public.users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        let { cart_product_ids, cart_quantity } = result.rows[0];

        // Ensure cart_product_ids and cart_quantity are arrays
        cart_product_ids = Array.isArray(cart_product_ids) ? cart_product_ids : [];
        cart_quantity = Array.isArray(cart_quantity) ? cart_quantity : [];

        // Find the index of the product to remove
        const index = cart_product_ids.indexOf(productId);
        if (index > -1) {
            // Remove the product and its quantity
            cart_product_ids.splice(index, 1);
            cart_quantity.splice(index, 1);
        }

        // Update the user's cart in the database
        await con.query(
            'UPDATE public.users SET cart_product_ids = $1, cart_quantity = $2 WHERE id = $3',
            [cart_product_ids, cart_quantity, userId]
        );

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (err) {
        console.error('Error removing product from cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/users/update-total-quantity', async (req, res) => {
    const { userId, totalQuantity } = req.body;
    try {
        await con.query(
            'UPDATE public.users SET total_quantity = $1 WHERE id = $2',
            [totalQuantity, userId]
        );
        res.status(200).json({ message: 'Total quantity updated successfully' });
    } catch (err) {
        console.error('Error updating total quantity:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/users/:userId/cart', async (req, res) => {
    const { userId } = req.params;
    try {
        // Fetch the user's cart details
        const result = await con.query('SELECT cart_product_id, cart_quantity FROM public.cart WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        let { cart_product_ids, cart_quantity } = result.rows[0];

        // Ensure cart_product_ids and cart_quantity are arrays
        cart_product_ids = Array.isArray(cart_product_ids) ? cart_product_ids : [];
        cart_quantity = Array.isArray(cart_quantity) ? cart_quantity : [];

        // Fetch product details for the cart items
        const productDetails = await con.query('SELECT * FROM public.products WHERE id = ANY($1)', [cart_product_ids]);

        // Map product details with quantities
        const cartItems = productDetails.rows.map(product => {
            const index = cart_product_ids.indexOf(product.id);
            return {
                ...product,
                cart_quantity: cart_quantity[index],
            };
        });

        res.status(200).json({ cartItems });
    } catch (err) {
        console.error('Error fetching cart details:', err);
        res.status(500).json({ message: 'Server error' });
    }
});



app.post('/api/users/decrease-qty', async (req, res) => {
    const { userId, productId } = req.body;
    try {
        // Fetch the current cart details
        const result = await con.query('SELECT cart_product_ids, cart_quantity FROM public.users WHERE id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        let { cart_product_ids, cart_quantity } = result.rows[0];

        // Ensure cart_product_ids and cart_quantity are arrays
        cart_product_ids = Array.isArray(cart_product_ids) ? cart_product_ids : [];
        cart_quantity = Array.isArray(cart_quantity) ? cart_quantity : [];

        // Find the index of the product to decrease quantity
        const index = cart_product_ids.indexOf(productId);
        if (index > -1 && cart_quantity[index] > 1) {
            // Decrease the quantity
            cart_quantity[index] -= 1;
        } else if (index > -1 && cart_quantity[index] <= 1) {
            // Remove the product if quantity is 1 or less
            cart_product_ids.splice(index, 1);
            cart_quantity.splice(index, 1);
        }

        // Update the user's cart in the database
        await con.query(
            'UPDATE public.users SET cart_product_ids = $1, cart_quantity = $2 WHERE id = $3',
            [cart_product_ids, cart_quantity, userId]
        );

        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/users/add-to-cart', async (req, res) => {
    const { userId, productIds, quantities, totalQuantity } = req.body; // Expecting productIds, quantities, and totalQuantity
    try {
        // Fetch the current cart details
        const result = await con.query('SELECT cart_product_id, cart_quantity FROM public.cart WHERE user_id = $1', [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        let { cart_product_ids, cart_quantity } = result.rows[0];

        // Ensure cart_product_ids and cart_quantity are arrays
        cart_product_ids = Array.isArray(cart_product_ids) ? cart_product_ids : [];
        cart_quantity = Array.isArray(cart_quantity) ? cart_quantity : [];

        // Log the existing quantities
        console.log(`Existing cart_product_ids: ${cart_product_ids}`);
        console.log(`Existing cart_quantity: ${cart_quantity}`);

        // Create a map to store the product IDs and their quantities
        const cartMap = new Map();
        cart_product_ids.forEach((id, index) => {
            cartMap.set(id, cart_quantity[index]);
        });

        // Add the new product IDs and quantities to the map
        for (let index = 0; index < productIds.length; index++) {
            const productId = productIds[index];
            const quantity = quantities[index];

            if (cartMap.has(productId)) {
                // Update the quantity if the product is already in the cart
                cartMap.set(productId, cartMap.get(productId) + quantity);
            } else {
                // Add the new product and quantity to the map
                cartMap.set(productId, quantity);
            }
        }

        // Convert the map back to arrays
        cart_product_ids = Array.from(cartMap.keys());
        cart_quantity = Array.from(cartMap.values());

        // Log the updated arrays and total quantity
        console.log(`Updated cart_product_ids: ${cart_product_ids}`);
        console.log(`Updated cart_quantity: ${cart_quantity}`);
        console.log(`Total quantity: ${totalQuantity}`);

        // Update the user's cart in the database using parameterized queries
        await con.query(
            'UPDATE public.cart SET cart_product_id = $1, cart_quantity = $2 WHERE user_id = $4',
            [cart_product_ids, cart_quantity, userId]
        );

        res.status(200).json({ message: 'Cart updated successfully' });
    } catch (err) {
        console.error('Error updating cart:', err);
        res.status(500).json({ message: 'Server error' });
    }
});






app.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Register request received:', req.body); // Log the request body
    try {
        // Check if the email or username already exists
        const emailCheck = await con.query('SELECT * FROM public.users WHERE email = $1', [email]);
        const nameCheck = await con.query('SELECT * FROM public.users WHERE name = $1', [name]);

        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (nameCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const result = await con.query(
            'INSERT INTO public.users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        const user = result.rows;
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: jwt.sign({ id: user.id, email: user.email, name: user.name }, 'secret', { expiresIn: '1h' }),
        });
    } catch (err) {
        console.error('Error during registration:', err); // Log the error
        res.status(500).json({ message: 'Server error' });
    }
});


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
