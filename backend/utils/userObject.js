const userObject = (user) => {
  return { id: user.id, email: user.email, role: user.role };
};

module.exports = userObject;
