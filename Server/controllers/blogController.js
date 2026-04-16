const db = require('../config/db');

exports.createBlog = async (req, res) => {
    try {
        const { title, content, featured_image } = req.body;
        
        // Auto-generate slug
        const slug = title.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Middleware theke user id pabe
        const author_id = req.user ? req.user.id : 1; 

        // Query-ta thik eivabe likhun (5 ta column = 5 ta value)
        const sql = "INSERT INTO blogs (author_id, title, slug, content, featured_image) VALUES (?, ?, ?, ?, ?)";
        
        await db.execute(sql, [author_id, title, slug, content, featured_image]);

        res.status(201).json({ success: true, message: "Blog posted successfully!" });
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
};