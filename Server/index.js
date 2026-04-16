const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http'); // Node built-in module
const { Server } = require('socket.io'); // Socket.io import
require('dotenv').config();

const app = express();

// --- HTTP Server Create (Socket er jonno dorkar) ---
const server = http.createServer(app);

// --- Socket.io Initializing ---
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Tomar frontend URL
        credentials: true,
        methods: ["GET", "POST"]
    }
});


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Routes Import
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogRoutes');
const adminRoutes = require('./routes/adminRoutes'); 
const tourRoutes = require('./routes/tourRoutes');
const staffRoutes = require('./routes/staffRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');
const messageRoutes = require('./routes/messageRoutes');
const announcementRoutes = require('./routes/announcementRoutes'); 
const analyticsRoutes = require('./routes/analyticsRoutes');
const registrationRoutes = require('./routes/userregistrationroute');
const testimonialRoutes = require('./routes/testimonialRoutes');
const visaRoutes = require('./routes/visaRoutes');
const userRoute = require('./routes/userRoute');
const userJobRoutes = require('./routes/userJobRoutes');
const travelRoutes = require('./routes/userTravelRoutes');
const flightRoutes = require('./routes/flightRoutes');
const b2bRoutes = require('./routes/b2bRoutes');
const employerRoutes = require('./routes/employerRoutes');
const b2bDashboardRoutes = require('./routes/B2bdashboardroutes');
const assignTaskRoutes = require('./routes/AssigntaskRoute');
const b2bPricingRoutes = require('./routes/b2bPricingRoutes');
//const adminworkerRequestRoutes = require("./routes/adminworkerRequestRoutes");

// ✅ Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/tours', tourRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/admin/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/announcements', announcementRoutes); 
app.use('/api/analytics', analyticsRoutes);
app.use('/api/verify', registrationRoutes);
app.use('/api', testimonialRoutes);
app.use('/api/visas', visaRoutes);
app.use('/api/users', userRoute);
app.use('/api/user-jobs', userJobRoutes);
app.use('/api/user-travel', travelRoutes);
app.use('/api', flightRoutes);
app.use('/api/b2b', b2bRoutes);
app.use('/api', employerRoutes);
app.use('/api/b2b/pricing', b2bPricingRoutes);//app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/b2b/dashboard', b2bDashboardRoutes);
app.use('/api/admin', assignTaskRoutes);
//app.use("/api/worker-requests", adminworkerRequestRoutes);

// Static Folder for Images
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// --- 🚀 Socket.io Logic Start ---
io.on('connection', (socket) => {
    console.log('User Connected:', socket.id);

    // Join Room: Ekhane sender ar receiver er ID diye ekta unique room hobe
    socket.on('join_chat', (data) => {
        // Safe Check: data null কিনা বা room আছে কিনা যাচাই করা
        if (data && data.room) {
            socket.join(data.room);
            console.log(`User joined room: ${data.room}`);
        } else {
            console.error("Warning: join_chat received with invalid data!", data);
        }
    });

    // Send Message Event
    socket.on('send_message', (data) => {
        // Safe Check: data এবং room নিশ্চিত করা
        if (data && data.room) {
            io.to(data.room).emit('receive_message', data);
        } else {
            console.error("Warning: send_message failed due to missing room data!");
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
});
// --- 🚀 Socket.io Logic End ---


// Simple Route for Testing
app.get('/', (req, res) => res.send('🚀 GAME ROUTES Backend with Socket.io is Running...'));

const PORT = process.env.PORT || 8080;

// ⚠️ MONEROBA: app.listen er poriborte server.listen hobe
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🔥 Server started on port ${PORT}`);
});