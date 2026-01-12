const managerOnly = (req, res, next) => {
  if (!req.user || req.user.role_id !== 3) {
    return res.status(403).json({
      message: "Access denied. Manager only.",
    });
  }

  next();
};

export default managerOnly;
