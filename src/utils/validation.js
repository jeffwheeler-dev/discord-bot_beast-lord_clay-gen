// src/utils/validation.js
const isValidNumber = (number) => {
    return !isNaN(number) && isFinite(number);
};

const hasRequiredRole = (member, requiredRoleId) => {
    return member.roles.cache.has(requiredRoleId);
};

module.exports = { isValidNumber, hasRequiredRole };
