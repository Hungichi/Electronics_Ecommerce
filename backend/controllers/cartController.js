const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Helper: find the user's cart or create an empty one if it doesn't exist yet.
async function getOrCreateCart(user_id) {
    let cart = await Cart.findOne({ user_id });
    if (!cart) cart = await Cart.create({ user_id, items: [] });
    return cart;
}

// Helper: return the cart with product details populated for each item.
async function populateCart(cart) {
    return Cart.findById(cart._id).populate({
        path: "items.product_id",
        select: "name price images stock category brand",
    });
}

const cartController = {
    // GET /cart/:userId
    // Returns the user's cart with each item's product details populated.
    getCart: async (req, res) => {
        try {
            const cart = await getOrCreateCart(req.params.userId);
            const populated = await populateCart(cart);
            res.status(200).json(populated);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // POST /cart/:userId/items   body: { product_id, quantity }
    // Adds a product to the cart. If it already exists, increments the quantity instead.
    addItem: async (req, res) => {
        try {
            const { product_id, quantity = 1 } = req.body;
            if (!product_id) return res.status(400).json("Missing product_id");

            // Verify the product exists before adding it.
            const product = await Product.findById(product_id);
            if (!product) return res.status(404).json("Product not found");

            const cart = await getOrCreateCart(req.params.userId);
            const existing = cart.items.find(
                (it) => it.product_id.toString() === product_id
            );

            if (existing) {
                existing.quantity += Number(quantity);
            } else {
                cart.items.push({ product_id, quantity: Number(quantity) });
            }

            await cart.save();
            const populated = await populateCart(cart);
            res.status(200).json(populated);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // PUT /cart/:userId/items/:productId   body: { quantity }
    // Sets the quantity of a single item. Removes the item if quantity <= 0.
    updateItem: async (req, res) => {
        try {
            const { quantity } = req.body;
            const cart = await getOrCreateCart(req.params.userId);
            const item = cart.items.find(
                (it) => it.product_id.toString() === req.params.productId
            );
            if (!item) return res.status(404).json("Item not in cart");

            if (Number(quantity) <= 0) {
                cart.items = cart.items.filter(
                    (it) => it.product_id.toString() !== req.params.productId
                );
            } else {
                item.quantity = Number(quantity);
            }

            await cart.save();
            const populated = await populateCart(cart);
            res.status(200).json(populated);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // DELETE /cart/:userId/items/:productId
    removeItem: async (req, res) => {
        try {
            const cart = await getOrCreateCart(req.params.userId);
            cart.items = cart.items.filter(
                (it) => it.product_id.toString() !== req.params.productId
            );
            await cart.save();
            const populated = await populateCart(cart);
            res.status(200).json(populated);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // DELETE /cart/:userId   -- clears every item from the user's cart.
    clearCart: async (req, res) => {
        try {
            const cart = await getOrCreateCart(req.params.userId);
            cart.items = [];
            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = cartController;
