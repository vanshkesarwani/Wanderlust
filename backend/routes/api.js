const express = require("express");
const router = express.Router();
const passport = require("passport");
const os = require("os");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: os.tmpdir() });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const cloudinary = require("../cloudConfig");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, isReviewAuthor, validateListing, validateReview } = require("../middleware.js");

const mapToken = process.env.MAP_TOKEN;
let geocodingClient = null;
if (mapToken) {
    try {
        geocodingClient = mbxGeocoding({ accessToken: mapToken });
    } catch (e) {
        console.warn("Mapbox geocoding initialization failed:", e.message);
    }
}

// Config endpoint for client
router.get("/config", (req, res) => {
    res.json({
        mapToken: process.env.MAP_TOKEN || ""
    });
});

// ================= AUTH ROUTES =================
router.get("/auth/current-user", (req, res) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return res.json({
            user: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email
            }
        });
    }
    res.json({ user: null });
});

router.post("/auth/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Username, email, and password are required" });
        }
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({
                message: "Signup successful!",
                user: {
                    _id: registeredUser._id,
                    username: registeredUser.username,
                    email: registeredUser.email
                }
            });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
}));

router.post("/auth/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ error: info?.message || "Invalid username or password" });
        }
        req.login(user, (loginErr) => {
            if (loginErr) return next(loginErr);
            return res.json({
                message: "Login successful!",
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email
                }
            });
        });
    })(req, res, next);
});

router.post("/auth/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ message: "Logged out successfully" });
    });
});

// ================= LISTING ROUTES =================
router.get("/listings", wrapAsync(async (req, res) => {
    const { category, search } = req.query;
    let query = {};

    if (search && search.trim()) {
        const escapeRegex = (s) => s.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&");
        const cleanSearch = search.trim();
        const rawTerms = cleanSearch.split(/[,\s]+/).filter(Boolean);
        const fullEscaped = escapeRegex(cleanSearch);

        if (rawTerms.length <= 1) {
            query = {
                $or: [
                    { title: { $regex: fullEscaped, $options: "i" } },
                    { location: { $regex: fullEscaped, $options: "i" } },
                    { country: { $regex: fullEscaped, $options: "i" } },
                    { description: { $regex: fullEscaped, $options: "i" } },
                ]
            };
        } else {
            // Multi-token search (e.g. "Goa, India", "Beach villa", "Malibu US")
            const tokenConditions = rawTerms.map((term) => {
                const safeTerm = escapeRegex(term);
                return {
                    $or: [
                        { title: { $regex: safeTerm, $options: "i" } },
                        { location: { $regex: safeTerm, $options: "i" } },
                        { country: { $regex: safeTerm, $options: "i" } },
                        { description: { $regex: safeTerm, $options: "i" } },
                    ]
                };
            });

            query = {
                $or: [
                    { title: { $regex: fullEscaped, $options: "i" } },
                    { location: { $regex: fullEscaped, $options: "i" } },
                    { country: { $regex: fullEscaped, $options: "i" } },
                    { description: { $regex: fullEscaped, $options: "i" } },
                    { $and: tokenConditions }
                ]
            };
        }
    }

    const listings = await Listing.find(query).sort({ _id: -1 });
    res.json({ listings });
}));

router.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author", select: "username" }
        })
        .populate("owner", "username email");

    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }
    res.json({ listing });
}));

router.post("/listings", isLoggedIn, upload.single("image"), wrapAsync(async (req, res) => {
    let listingData = req.body;
    if (req.body.listing) {
        try {
            listingData = typeof req.body.listing === "string" ? JSON.parse(req.body.listing) : req.body.listing;
        } catch (e) {
            listingData = req.body.listing;
        }
    }

    // Geocoding
    let geometry = { type: "Point", coordinates: [77.2090, 28.6139] };
    if (geocodingClient && listingData.location) {
        try {
            const geoRes = await geocodingClient.forwardGeocode({
                query: `${listingData.location}, ${listingData.country || ""}`,
                limit: 1
            }).send();
            if (geoRes?.body?.features?.length > 0) {
                geometry = geoRes.body.features[0].geometry;
            }
        } catch (geoErr) {
            console.warn("Geocoding failed, using fallback:", geoErr.message);
        }
    }

    // Image handling
    let image = {
        url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b",
        filename: "default"
    };

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            image = { url: result.secure_url, filename: result.public_id };
        } catch (cloudErr) {
            console.warn("Cloudinary upload failed:", cloudErr.message);
        } finally {
            fs.unlink(req.file.path, () => {});
        }
    } else if (listingData.image) {
        const imgUrl = typeof listingData.image === "object" ? listingData.image.url : listingData.image;
        if (imgUrl) {
            image = { url: imgUrl, filename: "webimage" };
        }
    }

    const newListing = new Listing({
        ...listingData,
        owner: req.user._id,
        image,
        geometry
    });

    const saved = await newListing.save();
    res.status(201).json({ message: "Listing created!", listing: saved });
}));

router.put("/listings/:id", isLoggedIn, isOwner, upload.single("image"), wrapAsync(async (req, res) => {
    const { id } = req.params;
    let listingData = req.body;
    if (req.body.listing) {
        try {
            listingData = typeof req.body.listing === "string" ? JSON.parse(req.body.listing) : req.body.listing;
        } catch (e) {
            listingData = req.body.listing;
        }
    }

    const updateFields = { ...listingData };

    if (req.file) {
        try {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateFields.image = { url: result.secure_url, filename: result.public_id };
        } catch (cloudErr) {
            console.warn("Cloudinary upload failed:", cloudErr.message);
        } finally {
            fs.unlink(req.file.path, () => {});
        }
    } else if (listingData.image) {
        const imgUrl = typeof listingData.image === "object" ? listingData.image.url : listingData.image;
        if (imgUrl) {
            updateFields.image = { url: imgUrl, filename: "webimage" };
        }
    }

    const updated = await Listing.findByIdAndUpdate(id, updateFields, { new: true });
    res.json({ message: "Listing updated!", listing: updated });
}));

router.delete("/listings/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted successfully" });
}));

// ================= REVIEWS ROUTES =================
router.post("/listings/:id/reviews", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
    }

    const reviewData = req.body.review || req.body;
    const newReview = new Review({
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment || ""
    });
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    await newReview.populate("author", "username");
    res.status(201).json({ message: "Review created!", review: newReview });
}));

router.delete("/listings/:id/reviews/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: "Review deleted successfully" });
}));

module.exports = router;
