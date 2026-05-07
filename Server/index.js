const express = require('express');
const cors    = require('cors');
const path    = require('path');
const http    = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app    = express();
const server = http.createServer(app);

// ─── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: ['https://snj-global-agency-3el5.vercel.app', 'http://localhost:5173', 'http://localhost:5174'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
    origin: [
        'https://snj-global-agency-3el5.vercel.app',
        'http://localhost:5000',
        //'https://snj-global-agency-backend.onrender.com',
        'http://localhost:5173',
        'http://localhost:5174'
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ────────────────────────────────────────────────────────────────────
const authRoutes          = require('./routes/auth');
const blogRoutes          = require('./routes/blogRoutes');
const adminRoutes         = require('./routes/adminRoutes');
const tourRoutes          = require('./routes/tourRoutes');
const staffRoutes         = require('./routes/staffRoutes');
const recruiterRoutes     = require('./routes/recruiterRoutes');
const jobRoutes           = require('./routes/jobRoutes');
const messageRoutes       = require('./routes/messageRoutes');
const announcementRoutes  = require('./routes/announcementRoutes');
const analyticsRoutes     = require('./routes/analyticsRoutes');
const registrationRoutes  = require('./routes/userregistrationroute');
const testimonialRoutes   = require('./routes/testimonialRoutes');
const visaRoutes          = require('./routes/visaRoutes');
const userRoute           = require('./routes/userRoute');
const userJobRoutes       = require('./routes/userJobRoutes');
const travelRoutes        = require('./routes/userTravelRoutes');
const flightRoutes        = require('./routes/flightRoutes');
const b2bRoutes           = require('./routes/b2bRoutes');
const employerRoutes      = require('./routes/employerRoutes');
const b2bDashboardRoutes  = require('./routes/B2bdashboardroutes');
const assignTaskRoutes    = require('./routes/AssigntaskRoute');
const b2bPricingRoutes    = require('./routes/b2bPricingRoutes');
const paymentRoutes       = require('./routes/paymentRoutes');
const employerPaymentRoutes = require('./routes/employerPaymentRoutes');
const applicantRoutes = require('./routes/applicantTrackingRoutes');

app.use('/api/auth',          authRoutes);
app.use('/api/blogs',         blogRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api/tours',         tourRoutes);
app.use('/api/staff',         staffRoutes);
app.use('/api/recruiter',     recruiterRoutes);
app.use('/api/admin/jobs',    jobRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/analytics',     analyticsRoutes);
app.use('/api/verify',        registrationRoutes);
app.use('/api',               testimonialRoutes);
app.use('/api/visas',         visaRoutes);
app.use('/api/users',         userRoute);
app.use('/api/user-jobs',     userJobRoutes);
app.use('/api/user-travel',   travelRoutes);
app.use('/api',               flightRoutes);
app.use('/api/b2b',           b2bRoutes);
app.use('/api',               employerRoutes);
app.use('/api/b2b/pricing',   b2bPricingRoutes);
app.use('/api/b2b/dashboard', b2bDashboardRoutes);
app.use('/api/admin',         assignTaskRoutes);
app.use('/api/payment',       paymentRoutes);
app.use('/api/employer-payment', employerPaymentRoutes);
app.use('/api/applicants', applicantRoutes);

// ─── Static Files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));

// ─── Socket.io Logic ───────────────────────────────────────────────────────────
// Track which socket belongs to which user (for admin → user pushes)
const userSockets = new Map(); // userId (string) → socket.id

io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // ── Join Chat Room ──────────────────────────────────────────────────────────
    // Client sends: { room: "chat_1_8" } or just { room: "8" } (user ID as room)
    socket.on('join_chat', (data) => {
        if (!data) return;

        const room = data.room || data;
        if (!room) return console.warn('join_chat: missing room', data);

        socket.join(String(room));
        console.log(`Socket ${socket.id} joined room: ${room}`);

        // Also register userId → socketId for admin push notifications
        if (data.userId) {
            userSockets.set(String(data.userId), socket.id);
        }
    });

    // ── Send Message ────────────────────────────────────────────────────────────
    // Client sends: { room, sender_id, receiver_id, message }
    socket.on('send_message', (data) => {
        if (!data || !data.room) {
            return console.warn('send_message: missing room', data);
        }
        // Broadcast to everyone in that room (including sender for confirmation)
        io.to(String(data.room)).emit('receive_message', {
            sender_id:   data.sender_id,
            receiver_id: data.receiver_id,
            message:     data.message,
            created_at:  new Date()
        });
    });

    // ── Admin Typing Indicator ──────────────────────────────────────────────────
    socket.on('admin_typing', (data) => {
        if (!data || !data.room) return;
        socket.to(String(data.room)).emit('admin_typing');
    });

    // ── Status Update (Admin sends this to notify user) ─────────────────────────
    // Usage: io.to(room).emit('status_update', { type, status })
    socket.on('send_status_update', (data) => {
        if (!data || !data.userId) return;
        const userRoom = String(data.userId);
        io.to(userRoom).emit('status_update', {
            type:   data.type,
            status: data.status
        });
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
        // Clean up userSockets map
        for (const [uid, sid] of userSockets.entries()) {
            if (sid === socket.id) { userSockets.delete(uid); break; }
        }
    });
});

// Export io for use in admin routes (push notifications)
app.set('io', io);
app.set('userSockets', userSockets);

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('🚀 SNJ GlobalRoutes Backend is Running'));

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Server started on port ${PORT}`);
});