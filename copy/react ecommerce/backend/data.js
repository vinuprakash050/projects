const products = [
    {
        id: '2',
        name: 'Fit Shirt',
        image: '/images/shirt.jpg',
        price: 600,
        brand: 'Arrow',
        rating: '3.7',
        numreviews: '35',
        description: 'The Fit Shirt by Arrow is designed for the modern man who values both style and functionality. Made from high-quality materials, this shirt ensures a comfortable fit and a sharp look, perfect for any event.',
        category: 'shirt',
        material: 'Cotton',
        color: 'Blue',
        size: 'M, L, XL',
        careInstructions: 'Machine wash cold, tumble dry low'
    },
    {
        id: '3',
        name: 'Oversized Shirt',
        image: '/images/oversized.jpg',
        price: 800,
        brand: 'Zudio',
        rating: '4.4',
        numreviews: '189',
        description: 'Stay ahead of the fashion curve with the Oversized Shirt from Zudio. This trendy piece offers a relaxed fit and is perfect for a laid-back, stylish look. Pair it with jeans or shorts for a versatile outfit.',
        category: 'shirt',
        material: 'Polyester',
        color: 'Black',
        size: 'S, M, L, XL',
        careInstructions: 'Hand wash, hang dry'
    },
    {
        id: '4',
        name: 'Denim Shirt',
        image: '/images/denim.jpg',
        price: 1200,
        brand: 'Crocs',
        rating: '4.0',
        numreviews: '135',
        description: 'The Denim Shirt by Crocs is a timeless classic that never goes out of style. Made from durable denim fabric, this shirt is perfect for a rugged, casual look. Wear it over a t-shirt or buttoned up for a versatile style.',
        category: 'shirt',
        material: 'Denim',
        color: 'Dark Blue',
        size: 'M, L, XL, XXL',
        careInstructions: 'Machine wash warm, tumble dry medium'
    },
    {
        id: '5',
        name: 'Polo Shirt',
        image: '/images/polo.jpg',
        price: 450,
        brand: 'Peter England',
        rating: '3.6',
        numreviews: '89',
        description: 'Elevate your casual wardrobe with the Polo Shirt from Peter England. Featuring a classic design and a comfortable fit, this shirt is perfect for a day out or a casual office look. Available in a variety of colors.',
        category: 'shirt',
        material: 'Cotton Blend',
        color: 'White',
        size: 'S, M, L, XL',
        careInstructions: 'Machine wash cold, tumble dry low'
    },
    {
        id: '6',
        name: 'Netted Shirt',
        image: '/images/netted.jpg',
        price: 1500,
        brand: 'Zara',
        rating: '4.3',
        numreviews: '20',
        description: 'Make a bold statement with the Netted Shirt from Zara. This unique piece features intricate netted detailing and is perfect for a night out or a special occasion. Stand out from the crowd with this stylish shirt.',
        category: 'shirt',
        material: 'Nylon',
        color: 'Red',
        size: 'M, L, XL',
        careInstructions: 'Hand wash, lay flat to dry'
    },
    {
        id: '7',
        name: 'Linen Shirt',
        image: '/images/lenin.jpg',
        price: 2000,
        brand: 'Levis',
        rating: '4.1',
        numreviews: '139',
        description: 'Stay cool and comfortable with the Linen Shirt from Levis. Made from breathable linen fabric, this shirt is perfect for warm weather. Its relaxed fit and classic design make it a must-have for any wardrobe.',
        category: 'shirt',
        material: 'Linen',
        color: 'Beige',
        size: 'S, M, L, XL, XXL',
        careInstructions: 'Machine wash cold, hang dry'
    },
    {
        id: '8',
        name: 'Slim Fit Pants',
        image: '/images/cargo.jpg',
        price: 700,
        brand: 'H&M',
        rating: '4.2',
        numreviews: '78',
        description: 'These Slim Fit Pants from H&M offer a sleek and modern look. Perfect for both casual and formal occasions, they are made from high-quality fabric for maximum comfort.',
        category: 'pant',
        material: 'Cotton',
        color: 'Black',
        size: '30, 32, 34, 36',
        careInstructions: 'Machine wash cold, tumble dry low'
    },
    {
        id: '9',
        name: 'Jogger Pants',
        image: '/images/pants.jpg',
        price: 900,
        brand: 'Nike',
        rating: '4.7',
        numreviews: '150',
        description: 'Stay comfortable and stylish with Nike’s Jogger Pants. Ideal for workouts or casual wear, these pants offer a relaxed fit and are made from breathable fabric.',
        category: 'pant',
        material: 'Polyester',
        color: 'Gray',
        size: 'S, M, L, XL',
        careInstructions: 'Machine wash cold, hang dry'
    },
    {
        id: '10',
        name: 'Cargo Pants',
        image: '/images/cargo.jpg',
        price: 950,
        brand: 'Adidas',
        rating: '4.3',
        numreviews: '65',
        description: 'Adidas Cargo Pants are perfect for outdoor activities. Featuring multiple pockets and a durable design, these pants are both functional and fashionable.',
        category: 'pant',
        material: 'Cotton Blend',
        color: 'Olive',
        size: '30, 32, 34, 36, 38',
        careInstructions: 'Machine wash warm, tumble dry medium'
    },

    {
        id: '11',
        name: 'Casual Pants',
        image: '/images/jean.jpg',
        price: 600,
        brand: 'Zara',
        rating: '4.1',
        numreviews: '120',
        description: 'Zara’s Casual Pants are a must-have for any casual outing. Comfortable and stylish, these pants are made from high-quality materials.',
        category: 'pant',
        material: 'jean',
        color: 'Beige',
        size: 'S, M, L, XL, XXL',
        careInstructions: 'Machine wash cold, hang dry'
    }
];
const users = [
    {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: '1234',
    },
    {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: '5678',
    },
];
module.exports = { products,users };
