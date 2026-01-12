const adminOnly = (req, res, next) => {
  console.log("ADMIN ONLY CHECK — req.user =", req.user);

  if (!req.user) {
    return res.status(401).json({
      message: "Unauthorized: no user in request",
    });
  }

  // ADMIN = role_id 1
  if (req.user.role_id !== 1) {
    return res.status(403).json({
      message: "Forbidden: Admin access only",
    });
  }

  next();
};

export default adminOnly;
