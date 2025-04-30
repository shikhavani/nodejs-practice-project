const adminAuth = (req, res, next) => {
    console.log("checking admin access");
    const token = "xyz56";
    const isAdminAuthorized = token === "xyz";
    if (isAdminAuthorized) {
        console.log("access validated");
        next();
    } else {
        res.status(401).send('Unauthorized access');
    }
};

const userAuth = (req, res, next) => {
    console.log("checking user access");
    const token = "xyz";
    const isAdminAuthorized = token === "xyz";
    if (isAdminAuthorized) {
        console.log("access validated");
        next();
    } else {
        res.status(401).send('Unauthorized access');
    }
};

module.exports = {adminAuth, userAuth} ;