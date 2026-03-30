const getUserSlug = (name = '') => {
    return name.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
};

export default getUserSlug;
